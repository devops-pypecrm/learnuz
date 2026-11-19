import mongoose from 'mongoose';

// Single-document collection holding the CRM connection details set on the admin Integration page.
const IntegrationSettingsSchema = new mongoose.Schema({
  crmApiKey: {
    type: String,
    default: '',
  },
  crmEndpointUrl: {
    type: String,
    default: '',
  },
}, { timestamps: true });

export default mongoose.models.IntegrationSettings || mongoose.model('IntegrationSettings', IntegrationSettingsSchema);
