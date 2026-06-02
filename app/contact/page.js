'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ContactFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    product: '',
    budget: 'Not Specified',
    priority: 'Normal',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const interest = searchParams.get('interest');
    if (interest) {
      setFormData(prev => ({ ...prev, product: interest }));
    }
  }, [searchParams]);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  /* ───── Validation Logic ───── */
  const validate = (data) => {
    const errs = {};

    // Name validation
    if (!data.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (data.name.trim().length < 3) {
      errs.name = 'Name must be at least 3 characters.';
    }

    // Phone validation - Indian mobile numbers
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (!data.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (phoneDigits.length < 10 || phoneDigits.length > 12) {
      errs.phone = 'Enter a valid 10-digit phone number.';
    }

    // Email validation (optional but must be valid if provided)
    if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errs.email = 'Enter a valid email address.';
    }

    // Product selection
    if (!data.product) {
      errs.product = 'Please select a product category.';
    }

    // Message validation
    if (!data.message.trim()) {
      errs.message = 'Please describe your requirements.';
    } else if (data.message.trim().length < 10) {
      errs.message = 'Please provide at least 10 characters of detail.';
    }

    return errs;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const nameMap = {
      'form-name': 'name',
      'form-phone': 'phone',
      'form-email': 'email',
      'form-product': 'product',
      'form-budget': 'budget',
      'form-priority': 'priority',
      'form-message': 'message'
    };
    const fieldKey = nameMap[id];
    const updated = { ...formData, [fieldKey]: value };
    setFormData(updated);

    // Live validation if the field was already touched
    if (touched[fieldKey]) {
      const newErrors = validate(updated);
      setErrors(prev => ({ ...prev, [fieldKey]: newErrors[fieldKey] || null }));
    }
  };

  const handleBlur = (e) => {
    const { id } = e.target;
    const nameMap = {
      'form-name': 'name',
      'form-phone': 'phone',
      'form-email': 'email',
      'form-product': 'product',
      'form-budget': 'budget',
      'form-priority': 'priority',
      'form-message': 'message'
    };
    const fieldKey = nameMap[id];
    setTouched(prev => ({ ...prev, [fieldKey]: true }));
    const newErrors = validate(formData);
    setErrors(prev => ({ ...prev, [fieldKey]: newErrors[fieldKey] || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run full validation
    const allErrors = validate(formData);
    setErrors(allErrors);

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(k => (allTouched[k] = true));
    setTouched(allTouched);

    if (Object.keys(allErrors).length > 0) {
      showNotification('Please fix the highlighted errors before submitting.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        showNotification(`Thank you, ${formData.name}! We have received your inquiry and will connect with you very soon. (Ref: ${data.data.inquiryId})`, 'success');

        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          product: '',
          budget: 'Not Specified',
          priority: 'Normal',
          message: ''
        });
        setErrors({});
        setTouched({});

        // Redirect to homepage after short delay
        setTimeout(() => {
          router.push('/');
        }, 2500);
      } else {
        showNotification(`Error: ${data.error || 'Failed to submit form.'}`, 'error');
      }
    } catch (err) {
      showNotification(`Connection error: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (fieldName) => {
    if (errors[fieldName] && touched[fieldName]) {
      return (
        <span className="form-error">
          <i className="fa-solid fa-circle-exclamation"></i> {errors[fieldName]}
        </span>
      );
    }
    return null;
  };

  const inputClass = (fieldName) => {
    if (touched[fieldName] && errors[fieldName]) return 'form-input input-error';
    if (touched[fieldName] && !errors[fieldName]) return 'form-input input-valid';
    return 'form-input';
  };

  const selectClass = (fieldName) => {
    if (touched[fieldName] && errors[fieldName]) return 'form-select input-error';
    if (touched[fieldName] && !errors[fieldName]) return 'form-select input-valid';
    return 'form-select';
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Get In Touch</span>
          <h2 className="section-title">Request A Free Custom Quote</h2>
          <p className="section-desc">Submit your signboard parameters, design files, or fabrication details, and our technical estimators will respond within 24 hours.</p>
        </div>

        <div className="contact-grid">
          {/* Left: Contact Details Panel */}
          <div className="contact-info-panel">
            <div>
              <h3>Contact Information</h3>
              <p>Have an immediate question or want a site audit in Surat? Connect directly with our team.</p>

              <div className="contact-details">
                <div className="contact-detail-item">
                  <div className="contact-detail-icon"><i className="fa-solid fa-user-tie"></i></div>
                  <div className="contact-detail-content">
                    <h4>Contact Person</h4>
                    <p>Amarkumar Lavne</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-detail-icon"><i className="fa-solid fa-phone-volume"></i></div>
                  <div className="contact-detail-content">
                    <h4>Call / WhatsApp</h4>
                    <p>
                      <a href="tel:+919727968268" style={{ color: 'inherit' }}>+91 97279 68268</a><br />
                      <a href="tel:+919173355684" style={{ color: 'inherit' }}>+91 91733 55684</a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-detail-icon"><i className="fa-solid fa-envelope-open-text"></i></div>
                  <div className="contact-detail-content">
                    <h4>Email Addresses</h4>
                    <p><a href="mailto:rohini.graphic08@gmail.com" style={{ color: 'var(--brand-color)' }}>rohini.graphic08@gmail.com</a></p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-detail-icon"><i className="fa-solid fa-map-location-dot"></i></div>
                  <div className="contact-detail-content">
                    <h4>Manufacturing Unit</h4>
                    <p>Shop No.1, Sapna Apartment, 10/540, Gajjar Sheri, Opp. Bank Of Baroda, Nr. Nagar Sheri, Pani Ni Bhit, Gopipura, Surat-395003, Gujarat</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '2rem', marginTop: '2rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-circle-check" style={{ color: 'var(--status-completed)' }}></i> MSME Registered &amp; GeM Registered Supplier
              </p>
            </div>
          </div>

          {/* Right: Interactive Quotation Form */}
          <div className="contact-form-panel">
            <h3>Let&apos;s Elevate Your Brand</h3>
            <form id="quote-form" onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="form-name" className="form-label">Full Name *</label>
                  <input
                    type="text"
                    id="form-name"
                    className={inputClass('name')}
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={submitting}
                  />
                  {fieldError('name')}
                </div>

                <div className="form-group">
                  <label htmlFor="form-phone" className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    id="form-phone"
                    className={inputClass('phone')}
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={submitting}
                  />
                  {fieldError('phone')}
                </div>

                <div className="form-group">
                  <label htmlFor="form-email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="form-email"
                    className={inputClass('email')}
                    placeholder="e.g. rajesh@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={submitting}
                  />
                  {fieldError('email')}
                </div>

                <div className="form-group">
                  <label htmlFor="form-product" className="form-label">Product of Interest *</label>
                  <select
                    id="form-product"
                    className={selectClass('product')}
                    value={formData.product}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={submitting}
                  >
                    <option value="" disabled>-- Select a Product Category --</option>
                    <option value="LED Letters">Premium LED Letters</option>
                    <option value="SS Metal Letters">Stainless Steel Metal Letters</option>
                    <option value="Acrylic Letters">Acrylic Signboards</option>
                    <option value="Marquee Bulbs">Retro Marquee Letters</option>
                    <option value="Lollipop Signs">Bracket Lollipop Signs</option>
                    <option value="ACP Facade">ACP Elevation Facade</option>
                    <option value="Safety Signs">Safety Signboards &amp; Cones</option>
                    <option value="Acrylic Name Plates">Acrylic Name Plates</option>
                    <option value="LED Lightboxes">LED Fabrics &amp; Clip-on Boards</option>
                    <option value="Publicity Services">Standees, Canopy &amp; Promo Tables</option>
                    <option value="Large Printing">Flex, Sunpack Banners</option>
                    <option value="Other Branding">Visiting Cards, Boxes, Custom Printing</option>
                  </select>
                  {fieldError('product')}
                </div>

                <div className="form-group">
                  <label htmlFor="form-budget" className="form-label">Estimated Budget (INR)</label>
                  <select
                    id="form-budget"
                    className="form-select"
                    value={formData.budget}
                    onChange={handleInputChange}
                    disabled={submitting}
                  >
                    <option value="Not Specified">Not Decided</option>
                    <option value="Under 10K">Under ₹10,000</option>
                    <option value="10K - 50K">₹10,000 - ₹50,000</option>
                    <option value="50K - 1.5L">₹50,000 - ₹1,50,000</option>
                    <option value="1.5L - 5L">₹1,50,000 - ₹5,00,000</option>
                    <option value="Above 5L">Above ₹5,00,000 (Corporate)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="form-priority" className="form-label">Urgency Level</label>
                  <select
                    id="form-priority"
                    className="form-select"
                    value={formData.priority}
                    onChange={handleInputChange}
                    disabled={submitting}
                  >
                    <option value="Normal">Normal Inquiry</option>
                    <option value="Medium">Need within 2 weeks</option>
                    <option value="High">Extremely Urgent (Site Opening!)</option>
                  </select>
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="form-message" className="form-label">Requirement Details *</label>
                  <textarea
                    id="form-message"
                    className={`form-textarea ${touched.message && errors.message ? 'input-error' : ''} ${touched.message && !errors.message ? 'input-valid' : ''}`}
                    placeholder="Describe the size, color preference, placement (indoor/outdoor), structure height, or other detailed branding requirements..."
                    value={formData.message}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={submitting}
                  ></textarea>
                  {fieldError('message')}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem 2rem', marginTop: '0.5rem' }}
                disabled={submitting}
              >
                <span>{submitting ? 'Sending Request...' : 'Submit Inquiry Details'}</span>
                <i className={`fa-solid ${submitting ? 'fa-spinner fa-spin' : 'fa-envelope-open-text'}`}></i>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Built-in React Toaster System */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <i className={`fa-solid ${toast.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="section" style={{ textAlign: 'center', paddingTop: '200px' }}>Loading contact panel...</div>}>
      <ContactFormContent />
    </Suspense>
  );
}
