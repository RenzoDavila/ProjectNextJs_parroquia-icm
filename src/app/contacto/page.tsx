"use client";

import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      {/* Hero Banner */}
      <section 
        className="relative h-[300px] md:h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1548625149-fc4a29cf7092?q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
            <p className="text-lg md:text-xl">Estamos aquí para ayudarte</p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-[#002F57] mb-8">Información de Contacto</h2>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#002F57] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#6DFFE5]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-[#002F57] mb-1">Dirección</h3>
                    <p className="text-gray-600">{SITE_CONFIG.address}</p>
                    <p className="text-gray-500 text-sm">Miraflores, Arequipa - Perú</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#002F57] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#6DFFE5]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-[#002F57] mb-1">Teléfono</h3>
                    <a 
                      href={`tel:${SITE_CONFIG.phone}`}
                      className="text-gray-600 hover:text-[#002F57] transition-colors"
                    >
                      {SITE_CONFIG.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#002F57] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#6DFFE5]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-[#002F57] mb-1">Correo Electrónico</h3>
                    <a 
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="text-gray-600 hover:text-[#002F57] transition-colors"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#002F57] rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#6DFFE5]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-[#002F57] mb-1">Horarios de Atención</h3>
                    <div className="text-gray-600 text-sm space-y-1">
                      <p><span className="font-medium">Lunes a Viernes:</span></p>
                      <p>8:00 a.m. - 12:30 p.m. / 4:00 p.m. - 6:30 p.m.</p>
                      <p><span className="font-medium">Sábados:</span></p>
                      <p>9:00 a.m. - 12:00 m.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h3 className="font-semibold text-[#002F57] mb-4">Síguenos en Redes Sociales</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://www.facebook.com/parroquia.miraflores.arequipa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://www.youtube.com/channel/UCKgN4YP_cOQd4LQYV1Ey5nw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#FF0000] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#002F57] mb-6">Envíanos un mensaje</h2>
              
              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <p className="text-green-700">¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.</p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                  <p className="text-red-700">Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002F57] focus:border-transparent"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002F57] focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002F57] focus:border-transparent"
                      placeholder="+51 999 999 999"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Asunto *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002F57] focus:border-transparent"
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="informacion">Información general</option>
                      <option value="bautismo">Consulta sobre Bautismo</option>
                      <option value="matrimonio">Consulta sobre Matrimonio</option>
                      <option value="misas">Consulta sobre Misas</option>
                      <option value="grupos">Grupos Parroquiales</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002F57] focus:border-transparent resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-[#002F57] text-white font-semibold rounded-lg hover:bg-[#001f3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Ubicación"
            subtitle="Encuéntranos fácilmente"
          />
          
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.6726621821184!2d-71.53730908513857!3d-16.393394988679436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91424a5c9b3d7e7f%3A0x4f9e5d9b8c7e6d5c!2sParroquia%20Inmaculado%20Coraz%C3%B3n%20de%20Mar%C3%ADa!5e0!3m2!1ses!2spe!4v1620000000000!5m2!1ses!2spe"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de la Parroquia"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-[#002F57]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Phone className="w-10 h-10 text-[#6DFFE5] mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Llámanos</h3>
              <a 
                href={`tel:${SITE_CONFIG.phone}`}
                className="text-[#6DFFE5] hover:underline"
              >
                {SITE_CONFIG.phone}
              </a>
            </div>
            <div>
              <Mail className="w-10 h-10 text-[#6DFFE5] mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Escríbenos</h3>
              <a 
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-[#6DFFE5] hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
            </div>
            <div>
              <MapPin className="w-10 h-10 text-[#6DFFE5] mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Visítanos</h3>
              <p className="text-gray-300 text-sm">{SITE_CONFIG.address}</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
