const express = require("express");
const pg = require("pg");

const client = new pg.Client('postgres://localhost:5432/juicebox');

async function getAllUsers() {
    const { rows } = await client.query(`
    SELECT id, username FROM users;
    `);

    return rows
};

async function createUser({ username, password }) {
    try {
        const result = await client.query(`
            INSERT INTO users(username, password)
            VALUES($1, $2);
        `, [username, password]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    client,
    getAllUsers,
    createUser,
};