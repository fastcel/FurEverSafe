/**
 * TEMP: Seeds adoption listings, applications, and pets for testing NGO Adoptions UI.
 *
 * Requirements:
 * - DATABASE_URL in server/.env (same as the API).
 * - At least 4 distinct citizen users in `users` (role citizen) to attach applications to.
 *
 * Usage (from repo root):
 *   node server/scripts/seed-ngo-adoptions-test-data.js
 *   node server/scripts/seed-ngo-adoptions-test-data.js other@example.com
 *
 * Env:
 *   NGO_SEED_EMAIL — NGO login email (default: ngo@ngo.com)
 *
 * Removes any prior seed for this NGO: pet names starting with __SEED_ADOPTIONS__
 */

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { pool } = require("../db");

const PREFIX = "__SEED_ADOPTIONS__";

const PROFILE_ROW = {
  full_name: "Seed Applicant",
  preferred_contact_method: "email",
  house_type: "apartment",
  monthly_income_range: "20000_40000",
  monthly_budget_range: "1000_2500",
  pet_alone_hours: "3_4",
  has_children: false,
  motivation: "Temporary seed data for NGO adoptions page testing.",
  contact_number: "+923000000000",
  email: "seed-applicant@example.test",
  /** `other_pets` is `text[]` in the database */
  other_pets: [],
};

async function insertApplication(client, listingId, userId, status) {
  const appRes = await client.query(
    `INSERT INTO adoption_applications (listing_id, user_id, status)
     VALUES ($1, $2, $3)
     RETURNING application_id`,
    [listingId, userId, status]
  );
  const applicationId = appRes.rows[0].application_id;
  await client.query(
    `INSERT INTO adoption_application_profiles (
       application_id, full_name, preferred_contact_method, house_type,
       monthly_income_range, monthly_budget_range, pet_alone_hours,
       has_children, motivation, contact_number, email, other_pets
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      applicationId,
      PROFILE_ROW.full_name,
      PROFILE_ROW.preferred_contact_method,
      PROFILE_ROW.house_type,
      PROFILE_ROW.monthly_income_range,
      PROFILE_ROW.monthly_budget_range,
      PROFILE_ROW.pet_alone_hours,
      PROFILE_ROW.has_children,
      PROFILE_ROW.motivation,
      PROFILE_ROW.contact_number,
      PROFILE_ROW.email,
      PROFILE_ROW.other_pets,
    ]
  );
  return applicationId;
}

async function main() {
  const ngoEmail = process.argv[2] || process.env.NGO_SEED_EMAIL || "ngo@ngo.com";

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const ngoRes = await client.query(
      `SELECT n.ngo_id FROM ngos n
       JOIN users u ON u.user_id = n.user_id
       WHERE LOWER(u.email) = LOWER($1) AND u.role = 'ngo'`,
      [ngoEmail]
    );
    if (!ngoRes.rows.length) {
      throw new Error(`No NGO user found with email: ${ngoEmail}`);
    }
    const ngoId = ngoRes.rows[0].ngo_id;

    const citizensRes = await client.query(
      `SELECT user_id FROM users WHERE role = 'citizen' ORDER BY user_id LIMIT 8`
    );
    const citizenIds = citizensRes.rows.map((r) => r.user_id);
    if (citizenIds.length < 4) {
      throw new Error("Need at least 4 citizen users in the database to run this seed.");
    }
    const [c1, c2, c3, c4] = citizenIds;

    await client.query(
      `DELETE FROM adoption_listings
       WHERE pet_id IN (
         SELECT pet_id FROM pets WHERE ngo_id = $1 AND name LIKE $2
       )`,
      [ngoId, `${PREFIX}%`]
    );
    await client.query(`DELETE FROM pets WHERE ngo_id = $1 AND name LIKE $2`, [
      ngoId,
      `${PREFIX}%`,
    ]);

    const typeRes = await client.query(
      `SELECT pet_type_id FROM pet_types WHERE LOWER(name) = 'cat' LIMIT 1`
    );
    if (!typeRes.rows.length) {
      throw new Error("No pet_types row for 'Cat'.");
    }
    const petTypeId = typeRes.rows[0].pet_type_id;

    async function createPetWithListing(name, breed, ageYears, city) {
      const petRes = await client.query(
        `INSERT INTO pets (
           ngo_id, name, breed, pet_type_id, gender, age, city,
           vaccination_status, description, status
         ) VALUES ($1,$2,$3,$4,'male',$5,$6,'fully_vaccinated','Seed pet for NGO adoptions UI.','available')
         RETURNING pet_id`,
        [ngoId, name, breed, petTypeId, ageYears, city]
      );
      const petId = petRes.rows[0].pet_id;
      await client.query(
        `INSERT INTO pet_images (pet_id, image_url) VALUES ($1, $2)`,
        [petId, "https://placecats.com/300/200"]
      );
      const listRes = await client.query(
        `INSERT INTO adoption_listings (ngo_id, pet_id, status)
         VALUES ($1, $2, 'pending')
         RETURNING listing_id`,
        [ngoId, petId]
      );
      return { petId, listingId: listRes.rows[0].listing_id };
    }

    // Ongoing tab: 3 pets with applications (not adopted)
    const milo = await createPetWithListing(`${PREFIX} Milo`, "Ginger", 3, "Lahore");
    await insertApplication(client, milo.listingId, c1, "pending");
    await insertApplication(client, milo.listingId, c2, "pending");
    await insertApplication(client, milo.listingId, c3, "rejected");
    await insertApplication(client, milo.listingId, c4, "rejected");

    const oliver = await createPetWithListing(`${PREFIX} Oliver`, "Siamese", 3, "Lahore");
    await insertApplication(client, oliver.listingId, c1, "rejected");
    await insertApplication(client, oliver.listingId, c2, "pending");
    await insertApplication(client, oliver.listingId, c3, "rejected");

    const willow = await createPetWithListing(`${PREFIX} Willow`, "Persian", 3, "Lahore");
    await insertApplication(client, willow.listingId, c1, "pending");
    await insertApplication(client, willow.listingId, c2, "pending");
    await insertApplication(client, willow.listingId, c3, "pending");

    // Accepted tab: one adopted pet with approved application
    const jim = await createPetWithListing(`${PREFIX} Jim`, "Sphynx", 3, "Lahore");
    await insertApplication(client, jim.listingId, c1, "approved");
    await insertApplication(client, jim.listingId, c2, "rejected");
    await client.query(`UPDATE pets SET status = 'adopted' WHERE pet_id = $1`, [jim.petId]);

    await client.query("COMMIT");
    console.log(`Seed complete for NGO email ${ngoEmail} (ngo_id=${ngoId}).`);
    console.log(`Log in as that NGO and open /ngo-adoptions. Remove later by re-running (cleanup) or deleting pets named like "${PREFIX}%".`);
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", e.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
