const pool = require('./dbConnection.js');
const table = process.env.TABLE_NAME;

// Get All contacts
const getContacts = async () => {
  const connection = await pool.getConnection();
  const [resp] = await connection.query(`SELECT * FROM ${table}`);
  connection.release();
  return resp;
};

// Get contact by ID
const getContactById = async (id) => {
  const connection = await pool.getConnection();

  if (!Number.isInteger(parseInt(id))) {
    return [];
  }
  const [resp] = await connection.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
  connection.release();
  return resp;
};

// Insert a new contact
const addContact = async ({ firstName, lastName, email, countryCode, phone, notes }) => {
  const connection = await pool.getConnection();

  // Duplication Check by Email
  const [resp] = await connection.query(`SELECT * FROM ${table} WHERE email = ?`, [
    email.toLowerCase()
  ]);
  if (resp.length > 0) {
    return { errors: ['email Already Exist'] };
  }

  // Insert data
  const [{ insertId }] = await connection.execute(
    `INSERT INTO ${table} (first_name, last_name, email, phone, country_code, notes) VALUES (?,?,?,?,?,?)`,
    [firstName, lastName, email.toLowerCase(), phone, countryCode, notes]
  );
  connection.release();
  return { id: insertId };
};

// Update contact By ID
const updateContact = async (id, { firstName, lastName, email, countryCode, phone, notes }) => {
  if (!Number.isInteger(parseInt(id))) {
    return { affectedRows: 0 };
  }

  const connection = await pool.getConnection();

  // Duplication Check by Email
  const [resp] = await connection.query(`SELECT * FROM ${table} WHERE email = ?`, [
    email.toLowerCase()
  ]);
  if (resp.length > 0) {
    return { errors: ['email Already Exist'] };
  }

  // Update data
  const [{ affectedRows }] = await connection.execute(
    `UPDATE ${table} SET first_name = ?, last_name = ?, email = ?, phone = ?, country_code = ?,  notes = ? WHERE ID = ?`,
    [firstName, lastName, email.toLowerCase(), phone, countryCode, notes, id]
  );
  connection.release();
  return { affectedRows };
};

// Delete a contact by ID
const deleteContactById = async (id) => {
  if (!Number.isInteger(parseInt(id))) {
    return { affectedRows: 0 };
  }

  const connection = await pool.getConnection();
  const [{ affectedRows }] = await connection.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
  connection.release();
  return { affectedRows };
};

module.exports = { getContacts, getContactById, addContact, updateContact, deleteContactById };
