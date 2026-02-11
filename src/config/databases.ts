import mongoose from "mongoose";

/**
 * Application databases
 */
export const userDb = mongoose.connection.useDb("user"); //Holds user data
export const insuranceDb = mongoose.connection.useDb("insurance"); //Holds insurance data