import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Database, 
  Shield, 
  Zap, 
  Search, 
  Download, 
  Lock,
  Server,
  Cloud,
  CheckCircle,
  ArrowRight,
  Table,
  FileText,
  Users,
  BarChart3
} from 'lucide-react';

const DatabaseFeaturePage = () => {
  const features = [
    {
      icon: Server,
      title: 'PostgreSQL Database',
      description: 'Enterprise-grade PostgreSQL database ensures reliable, scalable storage for all your land records with full ACID compliance.'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'AES-256 encryption at rest and in transit. Role-based access control keeps your data protected from unauthorized access.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast Queries',
      description: 'Optimized indexing and query caching delivers search results in milliseconds, even with millions of records.'
    },
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Full-text search across all fields including translated content. Find any record by owner name, location, or ID.'
    },
    {
      icon: Cloud,
      title: 'Cloud-Native',
      description: 'Hosted on Supabase with automatic backups, high availability, and 99.9% uptime guarantee.'
    },
    {
      icon: Download,
      title: 'Easy Export',
      description: 'Export your data in multiple formats: CSV, Excel, JSON, or generate professional PDF reports.'
    }
  ];

  const dataStructure = [
    { field: 'Record ID', type: 'UUID', description: 'Unique identifier for each record' },
    { field: 'Owner Name', type: 'Text', description: 'Property owner\'s full name (translated)' },
    { field: 'Land Area', type: 'Numeric', description: 'Total area in acres/hectares' },
    { field: 'Location', type: 'Text', description: 'Village, tehsil, and district' },
    { field: 'Survey Number', type: 'Text', description: 'Official survey/khasra number' },
    { field: 'Original Text', type: 'Text', description: 'Extracted Urdu/Hindi text' },
    { field: 'Translated Text', type: 'Text', description: 'English translation' },
    { field: 'Document Image', type: 'URL', description: 'Link to original scanned document' },
    { field: 'Created At', type: 'Timestamp', description: 'Record creation date' },
    { field: 'Confidence Score', type: 'Numeric', description: 'OCR accuracy percentage' }
  ];

  const stats = [
    { value: '50K+', label: 'Records Stored', icon: FileText },
    { value: '99.9%', label: 'Uptime', icon: Server },
    { value: '<100ms', label: 'Query Speed', icon: Zap },
    { value: '256-bit', label: 'Encryption', icon: Lock }
  ];

  return (
    <div className="min-h-screen bg-white text-[#292929]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 mb-6">
              <Database className="w-5 h-5 text-[#292929]" />
              <span className="text-sm font-medium">Structured Database Storage</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Your Data, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Organized & Secure</span>
            </h1>
            <p className="text-xl text-[#292929] max-w-3xl mx-auto mb-10">
              All extracted and translated land records are automatically stored in a structured, searchable database ready for AgriStack integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#292929] text-white font-bold hover:bg-neutral-800 transition-colors"
              >
                Access Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/features/ocr" 
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#292929] text-[#292929] font-bold hover:bg-neutral-100 transition-colors"
              >
                Start with OCR
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-[#292929]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-white" />
                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-neutral-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl font-bold mb-4">Why Our Database?</h2>
            <p className="text-xl text-[#292929] max-w-2xl mx-auto">
              Built for performance, security, and scalability
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-[#292929] flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-[#292929]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Structure Table */}
      <section className="py-16 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 mb-6">
              <Table className="w-5 h-5" />
              <span className="text-sm font-medium">Data Schema</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Structured Data Fields</h2>
            <p className="text-xl text-[#292929] max-w-2xl mx-auto">
              Every extracted record is organized into these structured fields
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#292929] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Field</th>
                    <th className="px-6 py-4 text-left font-semibold">Type</th>
                    <th className="px-6 py-4 text-left font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {dataStructure.map((row, index) => (
                    <tr key={index} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{row.field}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-neutral-100 text-sm font-mono">
                          {row.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#292929]">{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready for AgriStack Integration
              </h2>
              <p className="text-lg text-[#292929] mb-8">
                Our database structure is designed to seamlessly integrate with the government's AgriStack initiative, enabling:
              </p>
              <ul className="space-y-4">
                {[
                  'Direct API access for government systems',
                  'Standard data formats (JSON, XML, CSV)',
                  'Bulk export capabilities',
                  'Real-time synchronization',
                  'Audit trails and versioning'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#292929] rounded-3xl p-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white">
                  <Users className="w-8 h-8" />
                  <div>
                    <div className="font-bold text-lg">Multi-User Access</div>
                    <div className="text-neutral-400">Role-based permissions for teams</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <BarChart3 className="w-8 h-8" />
                  <div>
                    <div className="font-bold text-lg">Analytics Dashboard</div>
                    <div className="text-neutral-400">Visualize processing statistics</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <Cloud className="w-8 h-8" />
                  <div>
                    <div className="font-bold text-lg">Cloud Backup</div>
                    <div className="text-neutral-400">Daily automated backups</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#292929]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Store Your Records?
            </h2>
            <p className="text-xl text-neutral-300 mb-10">
              Start processing documents now and see your data organized in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#292929] font-bold hover:bg-neutral-100 transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white text-white font-bold hover:bg-white hover:text-[#292929] transition-colors"
              >
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DatabaseFeaturePage;
