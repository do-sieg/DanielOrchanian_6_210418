import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Plugin to manage unique emails
userSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

export default mongoose.model('User', userSchema);

