import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Users, Award, Heart, Zap } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const AboutPage = () => {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Leveraging cutting-edge AI to solve real-world agricultural challenges'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Impact',
      description: 'Empowering farmers and agricultural stakeholders with digital tools'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Excellence',
      description: 'Delivering the highest quality OCR and translation services'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Collaboration',
      description: 'Working together with government and agricultural organizations'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#292929]">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About AgriStack OCR</h1>
            <p className="text-xl text-[#292929] leading-relaxed">
              We're on a mission to digitize India's agricultural heritage, one land record at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="w-16 h-16 rounded-full bg-[#292929] flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-[#292929] leading-relaxed">
              To bridge the digital divide in Indian agriculture by transforming millions of legacy land records into accessible, searchable, and actionable data through advanced AI technology.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="w-16 h-16 rounded-full bg-[#292929] flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-[#292929] leading-relaxed">
              A future where every land record in India is digitized, accessible, and integrated with the AgriStack platform, enabling data-driven agricultural planning and empowering millions of farmers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8 text-center">Our Story</h2>
            <div className="space-y-6 text-lg text-[#292929] leading-relaxed">
              <p>
                AgriStack OCR was born from a simple observation: millions of critical land records across India remain trapped in paper form, written in Urdu and Hindi, making them inaccessible to modern agricultural technology.
              </p>
              <p>
                Our founding team, combining expertise in AI, agriculture, and public policy, recognized that digitizing these records was essential for the success of India's AgriStack initiative. However, manual digitization was too slow and expensive to scale.
              </p>
              <p>
                We developed an AI-powered solution that combines Google Vision API's OCR capabilities with AI4Bharat's translation models, specifically optimized for land records. The result? A system that can process documents in minutes that would take humans hours or days.
              </p>
              <p>
                Today, we're proud to support government agencies, agricultural organizations, and research institutions in their digital transformation journey.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#292929] mx-auto mb-4 flex items-center justify-center text-white">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-[#292929]">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#292929] text-white rounded-2xl p-8 text-center"
            >
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-lg">Documents Processed</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#292929] text-white rounded-2xl p-8 text-center"
            >
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-lg">Accuracy Rate</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#292929] text-white rounded-2xl p-8 text-center"
            >
              <div className="text-5xl font-bold mb-2">10+</div>
              <div className="text-lg">Partner Organizations</div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
