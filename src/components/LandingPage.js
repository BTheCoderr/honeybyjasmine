import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper component for meal images with fallback
const MealImage = ({ src, alt, mealName }) => {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="bg-gradient-to-br from-[#1a4d2e] to-[#2d5016] rounded-xl h-48 flex items-center justify-center">
        <span className="text-white text-sm font-semibold">Meal Photo</span>
      </div>
    );
  }

  // Encode the src URL to handle spaces and special characters in filenames
  const encodedSrc = src.split('/').map((part, index) => 
    index === src.split('/').length - 1 ? encodeURIComponent(part) : part
  ).join('/');

  return (
    <div className="rounded-xl h-48 mb-4 overflow-hidden">
      <img
        src={encodedSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [emailForm, setEmailForm] = useState({
    firstName: '',
    email: '',
    city: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll animations using Intersection Observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll('section');
      sections.forEach((section) => {
        section.classList.add('opacity-0', 'transition-opacity', 'duration-700', 'ease-out');
        observer.observe(section);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      const sections = document.querySelectorAll('section');
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Smooth scroll handler for anchor links
  const handleAnchorClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    // Close mobile menu if open
    setMobileMenuOpen(false);
  };

  // Back to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!emailForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!emailForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    return errors;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      // Use Netlify function in production, local API in development
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/.netlify/functions/subscribe'
        : 'http://localhost:3001/api/subscribe';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      // Success
      setFormSubmitted(true);
      setEmailForm({ firstName: '', email: '', city: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Subscription error:', error);
      setFormErrors({
        submit: error.message || 'Something went wrong. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailForm({
      ...emailForm,
      [name]: value
    });
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2d5016]">
      {/* Header and Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/balanced-bite-logo.svg" 
                alt="THE BALANCED BITE - honey by Jasmine"
                className="h-12 sm:h-16 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="#weekly-menu" 
                onClick={(e) => handleAnchorClick(e, 'weekly-menu')}
                className="text-[#1a4d2e] hover:text-[#1a4d2e] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] focus:ring-offset-2 rounded"
                aria-label="Navigate to Weekly Menu section"
              >
                Weekly Menu
              </a>
              <a 
                href="#meal-plans" 
                onClick={(e) => handleAnchorClick(e, 'meal-plans')}
                className="text-[#1a4d2e] hover:text-[#1a4d2e] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] focus:ring-offset-2 rounded"
                aria-label="Navigate to Meal Plans section"
              >
                Meal Plans
              </a>
              <a 
                href="#how-it-works" 
                onClick={(e) => handleAnchorClick(e, 'how-it-works')}
                className="text-[#1a4d2e] hover:text-[#1a4d2e] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] focus:ring-offset-2 rounded"
                aria-label="Navigate to How It Works section"
              >
                How It Works
              </a>
              <a 
                href="#about" 
                onClick={(e) => handleAnchorClick(e, 'about')}
                className="text-[#1a4d2e] hover:text-[#1a4d2e] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] focus:ring-offset-2 rounded"
                aria-label="Navigate to About Jasmine section"
              >
                About Jasmine
              </a>
              <a 
                href="#contact" 
                onClick={(e) => handleAnchorClick(e, 'contact')}
                className="text-[#1a4d2e] hover:text-[#1a4d2e] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] focus:ring-offset-2 rounded"
                aria-label="Navigate to Contact section"
              >
                Contact
              </a>
              <button 
                onClick={() => navigate('/order')}
                className="bg-[#1a4d2e] hover:bg-[#2d5016] text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] focus:ring-offset-2"
                aria-label="Order meals now"
              >
                Order Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t border-[#e8e0d5]">
              <a 
                href="#weekly-menu" 
                onClick={(e) => handleAnchorClick(e, 'weekly-menu')}
                className="block text-[#1a4d2e] hover:text-[#1a4d2e] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] rounded px-2 py-1"
                aria-label="Navigate to Weekly Menu section"
              >
                Weekly Menu
              </a>
              <a 
                href="#meal-plans" 
                onClick={(e) => handleAnchorClick(e, 'meal-plans')}
                className="block text-[#1a4d2e] hover:text-[#1a4d2e] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] rounded px-2 py-1"
                aria-label="Navigate to Meal Plans section"
              >
                Meal Plans
              </a>
              <a 
                href="#how-it-works" 
                onClick={(e) => handleAnchorClick(e, 'how-it-works')}
                className="block text-[#1a4d2e] hover:text-[#1a4d2e] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] rounded px-2 py-1"
                aria-label="Navigate to How It Works section"
              >
                How It Works
              </a>
              <a 
                href="#about" 
                onClick={(e) => handleAnchorClick(e, 'about')}
                className="block text-[#1a4d2e] hover:text-[#1a4d2e] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] rounded px-2 py-1"
                aria-label="Navigate to About Jasmine section"
              >
                About Jasmine
              </a>
              <a 
                href="#contact" 
                onClick={(e) => handleAnchorClick(e, 'contact')}
                className="block text-[#1a4d2e] hover:text-[#1a4d2e] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] rounded px-2 py-1"
                aria-label="Navigate to Contact section"
              >
                Contact
              </a>
              <button 
                onClick={() => navigate('/order')}
                className="w-full bg-[#1a4d2e] hover:bg-[#2d5016] text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] focus:ring-offset-2"
                aria-label="Order meals now"
              >
                Order Now
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a4d2e] leading-tight mb-6">
                I take the stress out of eating better.
              </h2>
              <p className="text-lg sm:text-xl text-[#2d5016] mb-8 leading-relaxed">
                Skip the grocery store stress and the takeout guilt. I cook fresh, balanced meals that save you time and money—and actually taste like home. No complicated plans, no judgment, just real food that fits your life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button 
                  onClick={() => navigate('/order')}
                  className="bg-[#1a4d2e] hover:bg-[#2d5016] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] focus:ring-offset-2"
                  aria-label="Order this week's menu"
                >
                  Order This Week's Menu
                </button>
                <button 
                  onClick={(e) => handleAnchorClick(e, 'how-it-works')}
                  className="bg-white hover:bg-[#f5f0e8] text-[#1a4d2e] border-2 border-[#1a4d2e] px-8 py-4 rounded-full font-semibold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] focus:ring-offset-2"
                  aria-label="Learn how it works"
                >
                  See How It Works
                </button>
              </div>
              <p className="text-sm text-[#2d5016] italic">
                Fresh, portion balanced meals, ready in minutes.
              </p>
            </div>
            <div className="hidden lg:flex justify-center lg:justify-end">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 md:p-10 flex items-center justify-center w-full max-w-md">
                <img
                  src="/images/hero/Feminine Logo Designs for Premium Honey Brand.svg"
                  alt="THE BALANCED BITE - honey by Jasmine"
                  className="w-full h-auto"
                  onError={(e) => {
                    // Fallback to PNG if SVG fails
                    if (e.target.src.includes('.svg')) {
                      e.target.src = '/images/hero/Feminine Logo Designs for Premium Honey Brand.png';
                    } else if (e.target.src.includes('.png')) {
                      // Fallback to JPG if PNG fails
                      e.target.src = '/images/hero/Feminine Logo Designs for Premium Honey Brand.jpg';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-16 sm:py-20 scroll-offset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="bg-[#faf8f5] rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#1a4d2e] rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1a4d2e] mb-4">Pick your meals</h3>
              <p className="text-[#1a4d2e] leading-relaxed">
                Choose from my weekly rotating menu of balanced, delicious options. Mix and match to fit your taste and goals.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#faf8f5] rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#1a4d2e] rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1a4d2e] mb-4">I cook with love</h3>
              <p className="text-[#1a4d2e] leading-relaxed">
                I prep, portion, and pack every meal fresh. Think home-cooked quality, better than restaurant consistency.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#faf8f5] rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-[#1a4d2e] rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1a4d2e] mb-4">Heat, eat, and repeat</h3>
              <p className="text-[#1a4d2e] leading-relaxed">
                Reheat in minutes and stay on track all week. No meal prep Sunday stress—just good food, ready when you are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1a4d2e] mb-6 text-center">
          Welcome to HoneyByJasmine
        </h2>
        <div className="space-y-4 text-lg text-[#1a4d2e] leading-relaxed">
          <p>
            I help busy people eat better without the guilt or overwhelm. This isn't about perfect meal plans or rigid rules—it's about real support for real lives.
          </p>
          <p>
            Wellness isn't one-size-fits-all, and neither are my meals. I build flexible options that work around your schedule, your preferences, and your goals. Whether you're just starting your wellness journey or you're a seasoned pro, I'm here to make eating clean feel cozy, fun, and actually doable.
          </p>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section id="meal-plans" className="bg-white py-16 sm:py-20 scroll-offset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a4d2e] mb-12 text-center">
            How I Can Help
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Weekly Meal Plans */}
            <div className="bg-[#faf8f5] rounded-2xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <h3 className="text-xl font-bold text-[#1a4d2e] mb-3">Weekly Meal Plans</h3>
              <p className="text-[#1a4d2e] mb-4 leading-relaxed">
                Complete packs for the entire week with balanced macros. Set it and forget it—your meals are ready.
              </p>
              <button onClick={() => navigate('/order')} className="text-[#1a4d2e] hover:text-[#2d5016] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] rounded">
                View options →
              </button>
            </div>

            {/* Build Your Box */}
            <div className="bg-[#faf8f5] rounded-2xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <h3 className="text-xl font-bold text-[#1a4d2e] mb-3">Build Your Box</h3>
              <p className="text-[#1a4d2e] mb-4 leading-relaxed">
                Custom mix and match meals. Pick exactly what you want, when you want it. Full control, zero stress.
              </p>
              <button onClick={() => navigate('/order')} className="text-[#1a4d2e] hover:text-[#2d5016] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] rounded">
                Learn more →
              </button>
            </div>

            {/* Honey Snacks */}
            <div className="bg-[#faf8f5] rounded-2xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <h3 className="text-xl font-bold text-[#1a4d2e] mb-3">Honey Snacks</h3>
              <p className="text-[#1a4d2e] mb-4 leading-relaxed">
                Healthy snacks and treats that actually satisfy. Perfect for between meals or when you need a little something sweet.
              </p>
              <button onClick={() => navigate('/order')} className="text-[#1a4d2e] hover:text-[#2d5016] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] rounded">
                View options →
              </button>
            </div>

            {/* Events and Catering */}
            <div className="bg-[#faf8f5] rounded-2xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <h3 className="text-xl font-bold text-[#1a4d2e] mb-3">Events and Catering</h3>
              <p className="text-[#1a4d2e] mb-4 leading-relaxed">
                Small gatherings, office lunches, and wellness events. Let me handle the food so you can enjoy the moment.
              </p>
              <button onClick={() => navigate('/order')} className="text-[#1a4d2e] hover:text-[#2d5016] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] rounded">
                Learn more →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Weekly Menu Preview */}
      <section id="weekly-menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 scroll-offset">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1a4d2e] mb-4 text-center">
          This Week's Honey Menu
        </h2>
        <p className="text-center text-[#1a4d2e] mb-12 max-w-2xl mx-auto">
          Fresh flavors rotate every week, and spots fill up fast. Order by Wednesday for this week's delivery.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Meal 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
            <MealImage 
              src="/images/meals/Pan-seared salmon over farro with a butternut squash.png" 
              alt="Pan-seared salmon over farro with butternut squash"
              mealName="Pan-seared Salmon over Farro"
            />
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-2">Pan-seared Salmon over Farro</h3>
            <p className="text-[#1a4d2e] mb-3 text-sm">
              Pan-seared salmon served over farro with a butternut squash. A hearty, nutritious meal that's both satisfying and delicious.
            </p>
            <div className="flex items-center justify-between">
              <span className="bg-[#e8f5e9] text-[#4a7c59] px-3 py-1 rounded-full text-xs font-semibold">
                High Protein
              </span>
              <span className="text-sm text-[#2d5016]">~450 cal</span>
            </div>
          </div>

          {/* Meal 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
            <MealImage 
              src="/images/meals/Vegetarian Mediterranean Powerbowl.png" 
              alt="Vegetarian Mediterranean Powerbowl"
              mealName="Vegetarian Mediterranean Powerbowl"
            />
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-2">Vegetarian Mediterranean Powerbowl</h3>
            <p className="text-[#1a4d2e] mb-3 text-sm">
              A vibrant bowl packed with Mediterranean flavors - chickpeas, roasted vegetables, olives, and fresh herbs over quinoa.
            </p>
            <div className="flex items-center justify-between">
              <span className="bg-[#e8f5e9] text-[#4a7c59] px-3 py-1 rounded-full text-xs font-semibold">
                Plant-Based
              </span>
              <span className="text-sm text-[#2d5016]">~420 cal</span>
            </div>
          </div>

          {/* Meal 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
            <MealImage 
              src="/images/meals/Levantine Chickpea & Pomegranate Fattoush.png" 
              alt="Levantine Chickpea & Pomegranate Fattoush"
              mealName="Levantine Chickpea & Pomegranate Fattoush"
            />
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-2">Levantine Chickpea & Pomegranate Fattoush</h3>
            <p className="text-[#1a4d2e] mb-3 text-sm">
              A vibrant Middle Eastern salad with chickpeas, fresh pomegranate seeds, herbs, and crispy bread. Fresh, flavorful, and plant-based.
            </p>
            <div className="flex items-center justify-between">
              <span className="bg-[#e8f5e9] text-[#4a7c59] px-3 py-1 rounded-full text-xs font-semibold">
                Plant-Based
              </span>
              <span className="text-sm text-[#2d5016]">~420 cal</span>
            </div>
          </div>

          {/* Meal 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
            <MealImage 
              src="/images/meals/Chicken Bacon Alfredo.png" 
              alt="Chicken Bacon Alfredo"
              mealName="Chicken Bacon Alfredo"
            />
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-2">Chicken Bacon Alfredo</h3>
            <p className="text-[#1a4d2e] mb-3 text-sm">
              Creamy alfredo pasta with tender chicken and crispy bacon. A comforting, indulgent meal that hits all the right notes.
            </p>
            <div className="flex items-center justify-between">
              <span className="bg-[#e8f5e9] text-[#4a7c59] px-3 py-1 rounded-full text-xs font-semibold">
                High Protein
              </span>
              <span className="text-sm text-[#2d5016]">~410 cal</span>
            </div>
          </div>

          {/* Meal 5 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
            <MealImage 
              src="/images/meals/Herb-Crusted Salmon with Garlic Spinach Cream.jpeg" 
              alt="Herb-Crusted Salmon with Garlic Spinach Cream"
              mealName="Herb-Crusted Salmon with Garlic Spinach Cream"
            />
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-2">Herb-Crusted Salmon with Garlic Spinach Cream</h3>
            <p className="text-[#1a4d2e] mb-3 text-sm">
              Perfectly seared salmon with a crispy herb crust, served over creamy garlic spinach. Elegant and full of flavor.
            </p>
            <div className="flex items-center justify-between">
              <span className="bg-[#e8f5e9] text-[#4a7c59] px-3 py-1 rounded-full text-xs font-semibold">
                Gluten Free
              </span>
              <span className="text-sm text-[#2d5016]">~480 cal</span>
            </div>
          </div>

          {/* Meal 6 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
            <MealImage 
              src="/images/meals/Grilled ribeye over a Caesar salad with homemade croutons.png" 
              alt="Grilled ribeye over a Caesar salad with homemade croutons"
              mealName="Grilled Ribeye over Caesar Salad"
            />
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-2">Grilled Ribeye over Caesar Salad</h3>
            <p className="text-[#1a4d2e] mb-3 text-sm">
              Tender grilled ribeye steak served over a classic Caesar salad with homemade croutons. A protein-packed, satisfying meal.
            </p>
            <div className="flex items-center justify-between">
              <span className="bg-[#e8f5e9] text-[#4a7c59] px-3 py-1 rounded-full text-xs font-semibold">
                High Protein
              </span>
              <span className="text-sm text-[#2d5016]">~460 cal</span>
            </div>
          </div>

          {/* Meal 7 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
            <MealImage 
              src="/images/meals/Spinach-Artichoke topped salmon with sautéed green beans.png" 
              alt="Spinach-Artichoke topped salmon with sautéed green beans"
              mealName="Spinach-Artichoke Topped Salmon"
            />
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-2">Spinach-Artichoke Topped Salmon</h3>
            <p className="text-[#1a4d2e] mb-3 text-sm">
              Tender salmon fillet topped with creamy spinach-artichoke dip, served alongside perfectly sautéed green beans.
            </p>
            <div className="flex items-center justify-between">
              <span className="bg-[#e8f5e9] text-[#4a7c59] px-3 py-1 rounded-full text-xs font-semibold">
                High Protein
              </span>
              <span className="text-sm text-[#2d5016]">~470 cal</span>
            </div>
          </div>

          {/* Meal 8 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
            <MealImage 
              src="/images/meals/Golden Mac and cheese.png" 
              alt="Golden Mac and cheese"
              mealName="Golden Mac and Cheese"
            />
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-2">Golden Mac and Cheese</h3>
            <p className="text-[#1a4d2e] mb-3 text-sm">
              Creamy, golden macaroni and cheese with a perfectly crispy top. The ultimate comfort food, made with love.
            </p>
            <div className="flex items-center justify-between">
              <span className="bg-[#e8f5e9] text-[#4a7c59] px-3 py-1 rounded-full text-xs font-semibold">
                Vegetarian
              </span>
              <span className="text-sm text-[#2d5016]">~520 cal</span>
            </div>
          </div>

          {/* Meal 9 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
            <MealImage 
              src="/images/meals/Grinder Salad Italian.png" 
              alt="Grinder Salad Italian"
              mealName="Italian Grinder Salad"
            />
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-2">Italian Grinder Salad</h3>
            <p className="text-[#1a4d2e] mb-3 text-sm">
              All the flavors of your favorite Italian grinder in a fresh, deconstructed salad. Salami, provolone, peppers, and Italian dressing.
            </p>
            <div className="flex items-center justify-between">
              <span className="bg-[#e8f5e9] text-[#4a7c59] px-3 py-1 rounded-full text-xs font-semibold">
                High Protein
              </span>
              <span className="text-sm text-[#2d5016]">~440 cal</span>
            </div>
          </div>

          {/* Meal 10 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
            <MealImage 
              src="/images/meals/Hot honey bacon egg and cheese.png" 
              alt="Hot honey bacon egg and cheese"
              mealName="Hot Honey Bacon Egg & Cheese"
            />
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-2">Hot Honey Bacon Egg & Cheese</h3>
            <p className="text-[#1a4d2e] mb-3 text-sm">
              A breakfast favorite elevated with crispy bacon, perfectly cooked eggs, melted cheese, and a drizzle of spicy hot honey.
            </p>
            <div className="flex items-center justify-between">
              <span className="bg-[#e8f5e9] text-[#4a7c59] px-3 py-1 rounded-full text-xs font-semibold">
                High Protein
              </span>
              <span className="text-sm text-[#2d5016]">~390 cal</span>
            </div>
          </div>

          {/* Meal 11 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
            <MealImage 
              src="/images/meals/Bruschetta Dip.png" 
              alt="Bruschetta Dip"
              mealName="Bruschetta Dip"
            />
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-2">Bruschetta Dip</h3>
            <p className="text-[#1a4d2e] mb-3 text-sm">
              Fresh tomatoes, basil, garlic, and mozzarella in a creamy dip. Perfect for sharing or enjoying as a light meal with bread.
            </p>
            <div className="flex items-center justify-between">
              <span className="bg-[#e8f5e9] text-[#4a7c59] px-3 py-1 rounded-full text-xs font-semibold">
                Vegetarian
              </span>
              <span className="text-sm text-[#2d5016]">~320 cal</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button 
            onClick={() => navigate('/order')}
            className="bg-[#1a4d2e] hover:bg-[#2d5016] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] focus:ring-offset-2"
            aria-label="View full menu and place order"
          >
            View Full Menu and Order
          </button>
        </div>
      </section>

      {/* Email Signup Section */}
      <section className="bg-gradient-to-br from-[#faf8f5] to-[#f5f0e8] py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-[#e8e0d5]">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a4d2e] mb-4 text-center">
              Join The Honey List
            </h2>
            <p className="text-center text-[#1a4d2e] mb-8 leading-relaxed">
              Subscribers get first access to the weekly menu, sold-out alerts, and occasional tips from me. No spam, just the good stuff.
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={emailForm.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    required
                    aria-label="First name"
                    aria-invalid={formErrors.firstName ? 'true' : 'false'}
                    aria-describedby={formErrors.firstName ? 'firstName-error' : undefined}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.firstName 
                        ? 'border-red-400 focus:ring-red-400' 
                        : 'border-[#e8e0d5] focus:ring-[#1a4d2e]'
                    } focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
                  />
                  {formErrors.firstName && (
                    <p id="firstName-error" className="mt-1 text-sm text-red-600" role="alert">
                      {formErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={emailForm.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    required
                    aria-label="Email address"
                    aria-invalid={formErrors.email ? 'true' : 'false'}
                    aria-describedby={formErrors.email ? 'email-error' : undefined}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      formErrors.email 
                        ? 'border-red-400 focus:ring-red-400' 
                        : 'border-[#e8e0d5] focus:ring-[#1a4d2e]'
                    } focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
                  />
                  {formErrors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <input
                  type="text"
                  name="city"
                  value={emailForm.city}
                  onChange={handleInputChange}
                  placeholder="City or area (optional)"
                  aria-label="City or area (optional)"
                  className="w-full px-4 py-3 rounded-lg border border-[#e8e0d5] focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] focus:border-transparent"
                />
              </div>
              {formErrors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-center" role="alert">
                  <p className="font-semibold">{formErrors.submit}</p>
                </div>
              )}
              {formSubmitted && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center" role="alert">
                  <p className="font-semibold">Thanks for joining The Honey List! 🍯</p>
                  <p className="text-sm mt-1">Check your email for confirmation.</p>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#1a4d2e] hover:bg-[#2d5016] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isSubmitting || formSubmitted}
                aria-label="Submit email signup form"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subscribing...
                  </>
                ) : formSubmitted ? (
                  'Subscribed! ✓'
                ) : (
                  'Get Weekly Menus'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Social Proof and Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1a4d2e] mb-12 text-center">
          What my clients are saying
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-[#1a4d2e] mb-4 italic leading-relaxed">
              "Jasmine's meals saved me so much time during the week. I actually look forward to eating healthy now, and the food tastes incredible."
            </p>
            <p className="text-[#1a4d2e] font-semibold">— Sarah M.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-[#1a4d2e] mb-4 italic leading-relaxed">
              "I've tried meal prep services before, but nothing compares. The portions are perfect, and I've been consistent for months now."
            </p>
            <p className="text-[#1a4d2e] font-semibold">— Michael T.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-[#1a4d2e] mb-4 italic leading-relaxed">
              "As someone new to meal prepping, Jasmine made it so easy. No judgment, just delicious food that fits my lifestyle."
            </p>
            <p className="text-[#1a4d2e] font-semibold">— Jessica L.</p>
          </div>
        </div>
      </section>

      {/* About Jasmine */}
      <section id="about" className="bg-white py-16 sm:py-20 scroll-offset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a4d2e] mb-12 text-center">
            Meet Jasmine
          </h2>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex justify-center lg:justify-end">
              <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full shadow-xl overflow-hidden bg-gradient-to-br from-[#1a4d2e] to-[#2d5016] flex items-center justify-center">
                <img
                  src="/images/about/jasmine-photo.jpg"
                  alt="Jasmine, founder of HoneyByJasmine"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (!e.target.parentElement.querySelector('.placeholder-text')) {
                      const placeholder = document.createElement('span');
                      placeholder.className = 'placeholder-text text-white text-lg font-semibold';
                      placeholder.textContent = "Jasmine's Photo";
                      e.target.parentElement.appendChild(placeholder);
                    }
                  }}
                />
              </div>
            </div>
            <div className="space-y-4 text-lg text-[#1a4d2e] leading-relaxed">
              <p>
                Hi, I'm Jasmine. I started HoneyByJasmine because I was tired of choosing between eating well and having a life. After years of juggling work, family, and trying to stay healthy, I realized that meal prep shouldn't feel like a chore—it should feel like someone's taking care of you.
              </p>
              <p>
                I've always loved food, but I love people more. That's why every meal I make is crafted with intention, balanced for real life, and packed with flavor. My mission is simple: make eating better feel human and sustainable, especially for people who are juggling a lot.
              </p>
              <p>
                Whether you're a busy parent, a working professional, or someone just starting their wellness journey, I'm here to make it easier. No complicated plans, no judgment—just good food that helps you feel your best.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1a4d2e] mb-12 text-center">
          Questions, answered
        </h2>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-3">How does delivery or pickup work?</h3>
            <p className="text-[#1a4d2e] leading-relaxed">
              I offer both local delivery and pickup options. Delivery is available within a 15-mile radius, and pickup is available at my kitchen location. You'll receive specific details and time slots when you place your order.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-3">When do I need to order by?</h3>
            <p className="text-[#1a4d2e] leading-relaxed">
              Orders for the weekly menu close every Wednesday at 11:59 PM. This gives me time to shop, prep, and cook fresh meals for delivery or pickup on Friday and Saturday.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-3">Can you accommodate allergies and dietary preferences?</h3>
            <p className="text-[#1a4d2e] leading-relaxed">
              Absolutely! I can accommodate most dietary needs including gluten-free, dairy-free, vegetarian, and vegan options. Just note your preferences when ordering, and I'll make sure your meals are prepared accordingly.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-3">How do I reheat the meals?</h3>
            <p className="text-[#1a4d2e] leading-relaxed">
              Most meals can be reheated in the microwave in 2-3 minutes, or in the oven at 350°F for 10-15 minutes. Each meal comes with specific reheating instructions to ensure the best taste and texture.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-3">Can I skip a week or cancel my order?</h3>
            <p className="text-[#1a4d2e] leading-relaxed">
              Yes! You can skip any week or cancel your order up to 24 hours before the order deadline (Tuesday at 11:59 PM). Just reach out to me directly, and I'll take care of it.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-3">How long do the meals stay fresh?</h3>
            <p className="text-[#1a4d2e] leading-relaxed">
              All meals are prepared fresh and can be stored in the refrigerator for up to 5 days. They're packaged in airtight containers to maintain freshness and flavor.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-[#1a4d2e] mb-3">Do you offer meal plans or just individual meals?</h3>
            <p className="text-[#1a4d2e] leading-relaxed">
              I offer both! You can order individual meals a la carte, or choose from weekly meal plans that include breakfast, lunch, and dinner options. Meal plans come with a discount and make it even easier to stay on track.
            </p>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#1a4d2e] hover:bg-[#2d5016] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] focus:ring-offset-2 z-40"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Footer */}
      <footer id="contact" className="bg-[#1a4d2e] text-white py-12 sm:py-16 scroll-offset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <img 
                src="/images/hero/Feminine Logo Designs for Premium Honey Brand.svg" 
                alt="THE BALANCED BITE - honey by Jasmine"
                className="h-12 sm:h-16 w-auto mb-4 brightness-0 invert"
                onError={(e) => {
                  // Fallback to PNG if SVG fails
                  if (e.target.src.includes('.svg')) {
                    e.target.src = '/images/hero/Feminine Logo Designs for Premium Honey Brand.png';
                  } else if (e.target.src.includes('.png')) {
                    // Fallback to JPG if PNG fails
                    e.target.src = '/images/hero/Feminine Logo Designs for Premium Honey Brand.jpg';
                  }
                }}
              />
              <p className="text-gray-400 text-sm">
                Fresh, balanced meals that make eating well feel easy.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a 
                    href="#weekly-menu" 
                    onClick={(e) => handleAnchorClick(e, 'weekly-menu')}
                    className="hover:text-[#1a4d2e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] rounded"
                  >
                    Weekly Menu
                  </a>
                </li>
                <li>
                  <a 
                    href="#meal-plans" 
                    onClick={(e) => handleAnchorClick(e, 'meal-plans')}
                    className="hover:text-[#1a4d2e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] rounded"
                  >
                    Meal Plans
                  </a>
                </li>
                <li>
                  <a 
                    href="#how-it-works" 
                    onClick={(e) => handleAnchorClick(e, 'how-it-works')}
                    className="hover:text-[#1a4d2e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] rounded"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a 
                    href="#about" 
                    onClick={(e) => handleAnchorClick(e, 'about')}
                    className="hover:text-[#1a4d2e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] rounded"
                  >
                    About Jasmine
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>hello@honeybyjasmine.com</li>
                <li>(555) 123-4567</li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-semibold mb-4">Follow Along</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a 
                    href="https://instagram.com/honeybyjasmine" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#1a4d2e] transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] rounded"
                    aria-label="Follow on Instagram"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.255-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </a>
                </li>
                <li>
                  <a 
                    href="https://tiktok.com/@honeybyjasmine" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#1a4d2e] transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-[#1a4d2e] rounded"
                    aria-label="Follow on TikTok"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} HoneyByJasmine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

