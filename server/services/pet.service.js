const { pool } = require("../db");

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

  let query = `
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
        SELECT image_url
        FROM listing_images li
        JOIN adoption_listings al
          ON al.listing_id = li.listing_id
        WHERE al.pet_id = p.pet_id
        LIMIT 1
      ) AS image_url

    FROM pets p

    LEFT JOIN pet_types pt
      ON pt.pet_type_id = p.pet_type_id

    LEFT JOIN ngos n
      ON n.ngo_id = p.ngo_id

    LEFT JOIN users u
      ON u.user_id = n.user_id

    WHERE p.status = 'available'
  `;

  const values = [];

  /* =========================
     SEARCH
  ========================= */
  if (search) {
    values.push(`%${search}%`);

    query += `
      AND (
        p.name ILIKE $${values.length}
        OR p.breed ILIKE $${values.length}
        OR p.city ILIKE $${values.length}
      )
    `;
  }

  /* =========================
     CATEGORY FILTER
  ========================= */
  if (category) {
    values.push(category);

    query += `
      AND LOWER(pt.name) = LOWER($${values.length})
    `;
  }

  /* =========================
     CITY FILTER
  ========================= */
  if (city) {
    values.push(city);

    query += `
      AND LOWER(p.city) = LOWER($${values.length})
    `;
  }

  /* =========================
     GENDER FILTER
  ========================= */
  if (gender) {
    values.push(gender);

    query += `
      AND LOWER(p.gender) = LOWER($${values.length})
    `;
  }

  /* =========================
     AGE FILTER
  ========================= */
  if (age) {

    // baby = 0-1
    if (age === "baby") {
      query += ` AND p.age BETWEEN 0 AND 1`;
    }

    // young = 2-5
    else if (age === "young") {
      query += ` AND p.age BETWEEN 2 AND 5`;
    }

    // adult = 6-10
    else if (age === "adult") {
      query += ` AND p.age BETWEEN 6 AND 10`;
    }

    // senior = 11+
    else if (age === "senior") {
      query += ` AND p.age >= 11`;
    }
  }

  /* =========================
     UPLOAD DATE FILTER
  ========================= */
  if (uploadDate) {

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
  }

  /* =========================
     SORTING
  ========================= */
  if (sort === "newest") {
    query += ` ORDER BY p.created_at DESC`;
  }

  else if (sort === "oldest") {
    query += ` ORDER BY p.created_at ASC`;
  }

  else if (sort === "alphabetical") {
    query += ` ORDER BY p.name ASC`;
  }

  else if (sort === "age_low_high") {
    query += ` ORDER BY p.age ASC`;
  }

  else if (sort === "age_high_low") {
    query += ` ORDER BY p.age DESC`;
  }

  else {
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
        SELECT image_url
        FROM listing_images li
        JOIN adoption_listings al
          ON al.listing_id = li.listing_id
        WHERE al.pet_id = p.pet_id
        LIMIT 1
      ) AS image_url

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

module.exports = {
  getAllPets,
  getPetById,
};