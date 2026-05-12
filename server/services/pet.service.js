const { pool } = require("../db");
const auditService = require("./audit.service");

/* =========================================
   GET ALL PETS (Dashboard)
========================================= */
const getAllPets = async (filters) => {
  const {
    search,
    category,
    city,
    gender,
    age,
    uploadDate,
    sort,
  } = filters;

  const values = [];

  let query = `
    SELECT
      p.pet_id,
      l.listing_id,
      p.name,
      p.breed,
      p.gender,
      p.age,
      p.city,
      p.vaccination_status,
      p.description,
      p.created_at,
      p.status,

      pt.name AS pet_type,

      n.ngo_id,
      u.name AS ngo_name,

      COALESCE(
        (
          SELECT json_agg(pi.image_url)
          FROM pet_images pi
          WHERE pi.pet_id = p.pet_id
        ),
        '[]'
      ) AS images

    FROM pets p

    LEFT JOIN pet_types pt
      ON pt.pet_type_id = p.pet_type_id

    LEFT JOIN ngos n
      ON n.ngo_id = p.ngo_id

    LEFT JOIN users u
      ON u.user_id = n.user_id
    
    LEFT JOIN adoption_listings l
      ON l.pet_id = p.pet_id

    WHERE p.status = 'available'
  `;

  /* =========================
     SEARCH
  ========================= */

  if (search?.trim()) {

    values.push(`%${search.trim()}%`);

    query += `
      AND (
        p.name ILIKE $${values.length}
        OR p.breed ILIKE $${values.length}
        OR p.city ILIKE $${values.length}
        OR pt.name ILIKE $${values.length}
      )
    `;
  }

  /* =========================
     CATEGORY
  ========================= */

  if (category) {

    values.push(category);

    query += `
      AND LOWER(pt.name) = LOWER($${values.length})
    `;
  }

  /* =========================
     CITY
  ========================= */

  if (city) {

    values.push(city);

    query += `
      AND LOWER(p.city) = LOWER($${values.length})
    `;
  }

  /* =========================
     GENDER
  ========================= */

  if (gender) {

    values.push(gender);

    query += `
      AND LOWER(p.gender) = LOWER($${values.length})
    `;
  }

  /* =========================
     AGE
  ========================= */

  if (age === "baby") {
    query += ` AND p.age BETWEEN 0 AND 1`;
  }

  else if (age === "young") {
    query += ` AND p.age BETWEEN 2 AND 5`;
  }

  else if (age === "adult") {
    query += ` AND p.age BETWEEN 6 AND 10`;
  }

  else if (age === "senior") {
    query += ` AND p.age >= 11`;
  }

  /* =========================
     UPLOAD DATE
  ========================= */

  if (uploadDate === "today") {

    query += `
      AND DATE(p.created_at) = CURRENT_DATE
    `;
  }

  else if (uploadDate === "week") {

    query += `
      AND p.created_at >= NOW() - INTERVAL '7 days'
    `;
  }

  else if (uploadDate === "month") {

    query += `
      AND p.created_at >= NOW() - INTERVAL '1 month'
    `;
  }

  else if (uploadDate === "year") {

    query += `
      AND p.created_at >= NOW() - INTERVAL '1 year'
    `;
  }

  /* =========================
     SORTING
  ========================= */

  switch (sort) {

    case "oldest":
      query += ` ORDER BY p.created_at ASC`;
      break;

    case "alphabetical":
      query += ` ORDER BY p.name ASC`;
      break;

    case "age_low_high":
      query += ` ORDER BY p.age ASC`;
      break;

    case "age_high_low":
      query += ` ORDER BY p.age DESC`;
      break;

    default:
      query += ` ORDER BY p.created_at DESC`;
  }

  const result = await pool.query(query, values);

  return result.rows;
};

/* =========================================
   GET SINGLE PET DETAILS
========================================= */
const getPetById = async (id) => {

  const query = `
    SELECT
      p.pet_id,
      p.name,
      p.breed,
      p.gender,
      p.age,
      p.city,
      p.vaccination_status,
      p.description,
      p.created_at,
      p.status,

      pt.name AS pet_type,

      n.ngo_id,
      u.name AS ngo_name,

      (
        SELECT json_agg(image_url)
        FROM pet_images pi
        WHERE pi.pet_id = p.pet_id
      ) AS images

    FROM pets p

    LEFT JOIN pet_types pt
      ON pt.pet_type_id = p.pet_type_id

    LEFT JOIN ngos n
      ON n.ngo_id = p.ngo_id

    LEFT JOIN users u
      ON u.user_id = n.user_id

    WHERE p.pet_id = $1
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

const addPet = async (data, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // =====================================================
    // STEP 1: GET NGO ID FROM USER
    // =====================================================
    const ngoResult = await client.query(
      `SELECT ngo_id FROM ngos WHERE user_id = $1`,
      [userId]
    );

    if (ngoResult.rows.length === 0) {
      throw new Error("NGO profile not found for this user");
    }

    const ngoId = ngoResult.rows[0].ngo_id;

    // =====================================================
    // STEP 2: GET PET TYPE ID
    // =====================================================
    const petTypeResult = await client.query(
      `SELECT pet_type_id FROM pet_types WHERE LOWER(name) = LOWER($1)`,
      [data.pet_type]
    );

    if (petTypeResult.rows.length === 0) {
      throw new Error("Invalid pet type");
    }

    const petTypeId = petTypeResult.rows[0].pet_type_id;

    // =====================================================
    // STEP 3: INSERT PET
    // =====================================================
    const petResult = await client.query(
      `
      INSERT INTO pets
      (
        ngo_id,
        name,
        breed,
        pet_type_id,
        gender,
        age,
        city,
        vaccination_status,
        description,
        status
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,'available')
      RETURNING *
      `,
      [
        ngoId,
        data.name,
        data.breed,
        petTypeId,
        data.gender || null,
        data.age,
        data.city,
        data.vaccination_status,
        data.description,
      ]
    );

    const pet = petResult.rows[0];

const listingResult = await client.query(
  `
  INSERT INTO adoption_listings (
    ngo_id,
    pet_id,
    status
  )
  VALUES ($1, $2, 'pending')
  RETURNING listing_id
  `,
  [ngoId, pet.pet_id]
);

const listing_id = listingResult.rows[0].listing_id;

    // =====================================================
    // STEP 4: INSERT IMAGES
    // =====================================================
    if (data.images && data.images.length > 0) {
      for (let img of data.images) {
        await client.query(
          `
          INSERT INTO pet_images (pet_id, image_url)
          VALUES ($1, $2)
          `,
          [pet.pet_id, img]
        );
      }
    }

    await client.query("COMMIT");

    await auditService.createAuditLog({
      admin_id: userId,
      action: "PET_CREATED",
      target_type: "pet",
      target_id: pet.pet_id,
      description: `Pet ${data.name} added by NGO ${ngoId}`,
    });

    return {
  ...pet,
  listing_id
};

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getNgoPets = async (userId) => {
  // 1. get ngo_id from user
  const ngoResult = await pool.query(
    `SELECT ngo_id FROM ngos WHERE user_id = $1`,
    [userId]
  );

  if (ngoResult.rows.length === 0) {
    throw new Error("NGO not found for this user");
  }

  const ngoId = ngoResult.rows[0].ngo_id;

  // 2. fetch pets
  const result = await pool.query(
    `
    SELECT
      p.pet_id,
      p.name,
      p.breed,
      p.gender,
      p.age,
      p.city,
      p.vaccination_status,
      p.description,
      p.status,
      p.created_at,

      pt.name AS pet_type,

      (
        SELECT json_agg(image_url)
        FROM pet_images pi
        WHERE pi.pet_id = p.pet_id
      ) AS images,

      (
        SELECT COUNT(*)
        FROM adoption_listings al
        WHERE al.pet_id = p.pet_id
      ) AS total_listings

    FROM pets p

    LEFT JOIN pet_types pt
      ON pt.pet_type_id = p.pet_type_id

    WHERE p.ngo_id = $1

    ORDER BY p.created_at DESC
    `,
    [ngoId]
  );

  return result.rows;
};

const updatePetPatch = async (userId, petId, data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Get NGO
    const ngoResult = await client.query(
      `SELECT ngo_id FROM ngos WHERE user_id = $1`,
      [userId]
    );

    if (ngoResult.rows.length === 0) {
      throw new Error("NGO not found");
    }

    const ngoId = ngoResult.rows[0].ngo_id;

    // 2. Verify ownership
    const petCheck = await client.query(
      `SELECT * FROM pets WHERE pet_id = $1 AND ngo_id = $2`,
      [petId, ngoId]
    );

    if (petCheck.rows.length === 0) {
      throw new Error("Pet not found or unauthorized");
    }

    const existing = petCheck.rows[0];

    // 3. Build PATCH values
    const updated = {
      name: data.name ?? existing.name,
      breed: data.breed ?? existing.breed,
      age: data.age ?? existing.age,
      city: data.city ?? existing.city,
      vaccination_status: data.vaccination_status ?? existing.vaccination_status,
      description: data.description ?? existing.description,
      gender: data.gender ?? existing.gender,
      status: data.status ?? existing.status,
    };

    // 4. Update query
    const result = await client.query(
      `
      UPDATE pets
      SET
        name = $1,
        breed = $2,
        age = $3,
        city = $4,
        vaccination_status = $5,
        description = $6,
        gender = $7,
        status = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE pet_id = $9
      RETURNING *
      `,
      [
        updated.name,
        updated.breed,
        updated.age,
        updated.city,
        updated.vaccination_status,
        updated.description,
        updated.gender,
        updated.status,
        petId,
      ]
    );

    const updatedPet = result.rows[0];

    if (Array.isArray(data.images) && data.images.length > 0) {
      await client.query(`DELETE FROM pet_images WHERE pet_id = $1`, [petId]);
      for (const img of data.images) {
        if (typeof img === "string" && img.trim()) {
          await client.query(
            `INSERT INTO pet_images (pet_id, image_url) VALUES ($1, $2)`,
            [petId, img.trim()]
          );
        }
      }
    }

    // 5. Audit log
    await auditService.createAuditLog({
      admin_id: userId,
      action: "PET_UPDATED",
      target_type: "pet",
      target_id: petId,
      description: `Pet ${petId} updated by NGO ${ngoId}`,
    });

    await client.query("COMMIT");

    return updatedPet;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  getAllPets,
  getPetById,
  addPet,
  getNgoPets,
  updatePetPatch,
};