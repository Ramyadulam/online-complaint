const mongoose = require("mongoose");

/* ========== USER SCHEMA ========== */
const userSchema = new mongoose.Schema({
  name: { type: String, required: "Name is required" },
  email: { type: String, required: "Email is required", unique: true },
  password: { type: String, required: "Password is required" },
  phone: {
    type: String,
    required: [true, "Phone is required"],
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit number`
    }
  },
  userType: { type: String, required: "UserType is required" }
}, { timestamps: true });

const UserModel = mongoose.model("user_Schema", userSchema);

/* ========== COMPLAINT SCHEMA ========== */
const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user_Schema", required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: Number, required: true },
  comment: { type: String, required: true },
  status: { type: String, required: true }
});

const ComplaintModel = mongoose.model("complaint_schema", complaintSchema);

/* ========== ASSIGNED COMPLAINT ========== */
const assignedComplaintSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "user_Schema", required: true },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "complaint_schema", required: true },
  status: { type: String, required: true },
  agentName: { type: String, required: true }
});

const AssignedComplaint = mongoose.model("assigned_complaint", assignedComplaintSchema);

/* ========== MESSAGE SCHEMA ========== */
const messageSchema = new mongoose.Schema({
  name: { type: String, required: "Name is required" },
  message: { type: String, required: "Message is required" },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "assigned_complaint" }
}, { timestamps: true });

const MessageModel = mongoose.model("message", messageSchema);

/* ========== EXPORT MODELS ========== */
module.exports = {
  UserModel,
  ComplaintModel,
  AssignedComplaint,
  MessageModel
};
