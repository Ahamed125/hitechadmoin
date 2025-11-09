import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  saveToFirebase, 
  loadFromFirebase, 
  COLLECTIONS 
} from '../../firebase';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

const initialSettings = {
  general: {
    siteName: 'Hi-Tec College',
    brandLogo: '',
    siteDescription: 'Leading institution for technical education and professional development',
    metaDescription: 'Hi-Tec College offers quality technical education with expert instructors and modern facilities.'
  },
  contact: {
    address: '7/2, waragashinna, Akurana-06, Kandy, Sri Lanka, 20850',
    verificationPhone: '0773066411',
    generalPhone: '0770044268',
    email: 'ainudeen@gmail.com',
    operatingHours: 'Mon-Sun: 9.00 A.M to 5.00 P.M',
    supportPhone: '+94770044268'
  },
  socialMedia: {
    facebook: 'https://web.facebook.com/hiteccollegelk',
    twitter: 'https://twitter.com/EduVision_Edu',
    linkedin: 'https://linkedin.com/company/eduvision-academy',
    instagram: 'https://instagram.com/eduvisionacademy',
    youtube: 'https://youtube.com/@ainudeenizzadeen8915?si=99dW00Y2gQL4y0mt'
  },
  footerLinks: {
    quickLinks: [
      { id: 1, name: 'All Courses', url: '/courses' },
      { id: 2, name: 'Our Faculty', url: '/faculty' },
      { id: 3, name: 'Facilities', url: '/facilities' },
      { id: 4, name: 'About Us', url: '/about' }
    ],
    supportLinks: [
      { id: 1, name: 'Contact Us', url: '/contact' },
      { id: 2, name: 'Help Center', url: '/help' },
      { id: 3, name: 'Student Portal', url: '/portal' },
      { id: 4, name: 'Career Services', url: '/careers' }
    ]
  },
  footer: {
    privacyPolicyUrl: '/privacy',
    termsOfServiceUrl: '/terms',
    accessibilityUrl: '/accessibility'
  },
  trustStats: {
    studentsCount: '50,000+',
    successRate: '95%',
    rating: '4.9/5',
    expertInstructors: '500+',
    coursesAvailable: '1,200+',
    jobPlacementRate: '95%',
    alumniNetwork: '50,000+'
  }
};

const initialHomepage = {
  hero: {
    slides: [
      {
        id: 1,
        h1: 'Unlock Your Potential',
        h2: 'Transform your future with world-class education',
        h3: 'Join thousands of successful graduates who have accelerated their careers',
        image: 'https://images.unsplash.com/photo-1592303637753-ce1e6b8a0ffb'
      },
      {
        id: 2,
        h1: 'Excellence in Education',
        h2: 'Learn from industry experts and world-renowned faculty',
        h3: 'Our distinguished faculty brings real-world experience and academic excellence',
        image: 'https://images.unsplash.com/photo-1701777508358-833de8c614ec'
      },
      {
        id: 3,
        h1: 'Your Success is Our Mission',
        h2: 'Join a community of achievers and unlock limitless possibilities',
        h3: 'With 95% job placement rate and alumni working at top companies worldwide',
        image: 'https://images.unsplash.com/photo-1665567031505-49c536110178'
      }
    ]
  },
  cta: {
    header: {
      h1: 'Ready to Start Your Journey?',
      h2: 'Enroll Now and Transform Your Career',
      h3: 'Join our community of learners and get access to world-class education'
    },
    cards: [
      {
        id: 1,
        icon: 'phone',
        h3: 'Call Us Directly',
        buttonName: 'Call Now',
        path: 'tel:+94770044268'
      },
      {
        id: 2,
        icon: 'map-pin',
        h3: 'Visit Our Campus',
        buttonName: 'Book Tour',
        path: '/contact'
      },
      {
        id: 3,
        icon: 'file-text',
        h3: 'Apply Online',
        buttonName: 'Apply Now',
        path: '/apply'
      }
    ]
  },
  quickStats: [
    { id: 1, text: 'Students Enrolled', icon: 'users', number: '50,000+' },
    { id: 2, text: 'Courses Available', icon: 'book', number: '1,200+' },
    { id: 3, text: 'Success Rate', icon: 'trending-up', number: '95%' },
    { id: 4, text: 'Expert Instructors', icon: 'award', number: '500+' }
  ],
  news: {
    header: {
      title: 'Join Our Events',
      subtitle: 'Upcoming Events & Announcements',
      description: 'Discover upcoming workshops, webinars, and networking events designed to help you grow professionally and personally.'
    },
    events: [
      {
        id: 1,
        title: "Virtual Career Fair 2024",
        date: "2025-11-15",
        time: "10:00 AM - 4:00 PM EST",
        type: "Virtual Event",
        description: "Connect with top employers and explore career opportunities across various industries.",
        registrations: 2847,
        image: "https://images.unsplash.com/photo-1551830410-95f3f2ce0b5a",
        imageAlt: "Virtual career fair with professionals networking online"
      },
      {
        id: 2,
        title: "AI in Education Webinar",
        date: "2025-11-08",
        time: "2:00 PM - 3:30 PM EST",
        type: "Webinar",
        description: "Learn how artificial intelligence is transforming modern education and career development.",
        registrations: 1523,
        image: "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4",
        imageAlt: "AI technology presentation in educational setting"
      }
    ]
  }
};

export const AdminProvider = ({ children }) => {
  const [settings, setSettings] = useState(initialSettings);
  const [homepage, setHomepage] = useState(initialHomepage);
  const [courses, setCourses] = useState([]);
  const [faqs, setFaqs] = useState({
    pageSettings: {
      sectionSubtitle: 'Common Questions',
      sectionTitle: 'Frequently Asked Questions',
      sectionDescription: 'Find answers to common questions about our courses and programs',
      contactTitle: 'Still Have Questions?',
      contactDescription: 'Our team is here to help you',
      contactPhone: '+94770044268',
      contactEmail: 'ainudeen@gmail.com'
    },
    categories: []
  });
  const [certificates, setCertificates] = useState({
    pageSettings: {
      pageTitle: 'Verify Certificate',
      pageDescription: 'Enter a registration number to verify a certificate',
      placeholderText: 'Enter registration number (e.g., M/HTC/FIC/825)',
      helpText: 'Registration number can be found on your certificate'
    },
    records: []
  });
  const [contact, setContact] = useState({
    methods: [
      {
        id: 1,
        icon: 'Phone',
        title: 'Call Us Directly',
        description: 'Speak with our admissions counselors for immediate assistance',
        primary: '+94770044268',
        secondary: '0773066411',
        hours: 'Mon-Fri: (9AM-5PM)',
        action: 'Call Now',
        actionType: 'phone'
      },
      {
        id: 2,
        icon: 'Mail',
        title: 'Email Support',
        description: 'Get detailed responses to your questions within 24 hours',
        primary: 'ainudeen@gmail.com',
        hours: 'Response within 24 hours',
        action: 'Send Email',
        actionType: 'email'
      }
    ],
    socialChannels: [
      { id: 1, name: 'Facebook', icon: 'Facebook', handle: '@Hi-Tec College', url: 'https://web.facebook.com/hiteccollegelk' },
      { id: 2, name: 'Twitter', icon: 'Twitter', handle: '@EduVision_Edu', url: 'https://twitter.com/EduVision_Edu' },
      { id: 3, name: 'LinkedIn', icon: 'Linkedin', handle: 'EduVision Academy', url: 'https://linkedin.com/company/eduvision-academy' },
      { id: 4, name: 'Instagram', icon: 'Instagram', handle: '@eduvisionacademy', url: 'https://instagram.com/eduvisionacademy' },
      { id: 5, name: 'YouTube', icon: 'Youtube', handle: '@Hi-Tec College', url: 'https://youtube.com/@ainudeenizzadeen8915?si=99dW00Y2gQL4y0mt' }
    ],
    campusLocations: [
      {
        id: 1,
        name: 'Main Campus',
        address: '7/2, Waragashinna, Akurana-06, Kandy, Sri Lanka, 20850',
        phone: '0770044268',
        email: 'ainudeen@gmail.com',
        hours: {
          weekdays: 'Monday - Friday: 9.00 A.M to 5.00 P.M',
          saturday: 'Saturday: 9.00 A.M to 5.00 P.M',
          sunday: 'Sunday: Closed'
        },
        services: ['Admissions Office', 'Student Services', 'Library', 'Computer Labs', 'Cafeteria'],
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.444193312178!2d80.6174838!3d7.3654368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3431a62170153%3A0xbd83f5eb0d99c647!2sHi-Tec%20College%20Akurana!5e0!3m2!1sen!2slk!4v1730270000000!5m2!1sen!2slk',
        isPrimary: true
      }
    ]
  });
  const [about, setAbout] = useState({
    hero: {
      badgeText: 'About Us',
      mainTitle1: 'Empowering',
      accentTitle: 'Future Leaders',
      description: 'With over 20 years of excellence in education',
      heroImage: '',
      imageAlt: 'About Hi-Tec College',
      watchVideoText: 'Watch Video',
      watchVideoLink: '#',
      exploreButtonText: 'Explore More',
      stats: [
        { id: 1, number: '20+', label: 'Years of Excellence' },
        { id: 2, number: '50K+', label: 'Student Gratuated' },
        { id: 3, number: '95%', label: 'Success Rate' }
      ],
    },
  });

  // Add messages state
  const [messages, setMessages] = useState({});
  const [oldMessages, setOldMessages] = useState({});
  const [messagesLoading, setMessagesLoading] = useState(true);

  const [loading, setLoading] = useState(true);

  // Load all data from Firebase on component mount
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [
          settingsData,
          homepageData,
          coursesData,
          faqsData,
          certificatesData,
          contactData,
          aboutData,
          messagesData,
          oldMessagesData
        ] = await Promise.all([
          loadFromFirebase(COLLECTIONS.SETTINGS),
          loadFromFirebase(COLLECTIONS.HOMEPAGE),
          loadFromFirebase(COLLECTIONS.COURSES),
          loadFromFirebase(COLLECTIONS.FAQS),
          loadFromFirebase(COLLECTIONS.CERTIFICATES),
          loadFromFirebase(COLLECTIONS.CONTACT),
          loadFromFirebase(COLLECTIONS.ABOUT),
          loadFromFirebase(COLLECTIONS.MESSAGES),
          loadFromFirebase(COLLECTIONS.OLD_MESSAGES)
        ]);

        if (settingsData.success) setSettings(settingsData.data);
        if (homepageData.success) setHomepage(homepageData.data);
        if (coursesData.success) setCourses(coursesData.data.courses || []);
        if (faqsData.success) setFaqs(faqsData.data);
        if (certificatesData.success) setCertificates(certificatesData.data);
        if (contactData.success) setContact(contactData.data);
        if (aboutData.success) setAbout(aboutData.data);
        if (messagesData.success) setMessages(messagesData.data || {});
        if (oldMessagesData.success) setOldMessages(oldMessagesData.data || {});

      } catch (error) {
        console.error('Error loading data from Firebase:', error);
      } finally {
        setLoading(false);
        setMessagesLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Save all data to Firebase
  const saveAllToFirebase = async () => {
    setLoading(true);
    try {
      const results = await Promise.all([
        saveToFirebase(COLLECTIONS.SETTINGS, settings),
        saveToFirebase(COLLECTIONS.HOMEPAGE, homepage),
        saveToFirebase(COLLECTIONS.COURSES, { courses }),
        saveToFirebase(COLLECTIONS.FAQS, faqs),
        saveToFirebase(COLLECTIONS.CERTIFICATES, certificates),
        saveToFirebase(COLLECTIONS.CONTACT, contact),
        saveToFirebase(COLLECTIONS.ABOUT, about)
      ]);

      const allSuccess = results.every(result => result.success);
      return allSuccess;
    } catch (error) {
      console.error('Error saving all data to Firebase:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Save only hero section to Firebase
  const saveHeroToFirebase = async () => {
    setLoading(true);
    try {
      const result = await saveToFirebase(COLLECTIONS.ABOUT, { 
        hero: about.hero 
      });
      return result.success;
    } catch (error) {
      console.error('Error saving hero section to Firebase:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Message management functions
  const loadMessages = async () => {
    setMessagesLoading(true);
    try {
      const [messagesResult, oldMessagesResult] = await Promise.all([
        loadFromFirebase(COLLECTIONS.MESSAGES),
        loadFromFirebase(COLLECTIONS.OLD_MESSAGES)
      ]);

      if (messagesResult.success) setMessages(messagesResult.data || {});
      if (oldMessagesResult.success) setOldMessages(oldMessagesResult.data || {});
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const updateMessageStatus = async (messageId, status) => {
    try {
      const updatedMessage = {
        ...messages[messageId],
        status,
        updatedAt: new Date().toISOString()
      };

      await saveToFirebase(COLLECTIONS.MESSAGES, {
        ...messages,
        [messageId]: updatedMessage
      });

      setMessages(prev => ({
        ...prev,
        [messageId]: updatedMessage
      }));

      return { success: true };
    } catch (error) {
      console.error('Error updating message status:', error);
      return { success: false, error: error.message };
    }
  };

  const archiveMessage = async (messageId) => {
    try {
      const message = messages[messageId];
      const archivedMessage = {
        ...message,
        status: 'archived',
        archivedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to old_messages
      await saveToFirebase(COLLECTIONS.OLD_MESSAGES, {
        ...oldMessages,
        [messageId]: archivedMessage
      });

      // Remove from active messages
      const updatedMessages = { ...messages };
      delete updatedMessages[messageId];
      await saveToFirebase(COLLECTIONS.MESSAGES, updatedMessages);

      setMessages(updatedMessages);
      setOldMessages(prev => ({
        ...prev,
        [messageId]: archivedMessage
      }));

      return { success: true };
    } catch (error) {
      console.error('Error archiving message:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteMessage = async (messageId, fromArchived = false) => {
    try {
      if (fromArchived) {
        const updatedOldMessages = { ...oldMessages };
        delete updatedOldMessages[messageId];
        await saveToFirebase(COLLECTIONS.OLD_MESSAGES, updatedOldMessages);
        setOldMessages(updatedOldMessages);
      } else {
        const updatedMessages = { ...messages };
        delete updatedMessages[messageId];
        await saveToFirebase(COLLECTIONS.MESSAGES, updatedMessages);
        setMessages(updatedMessages);
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting message:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    settings,
    setSettings,
    homepage,
    setHomepage,
    courses,
    setCourses,
    faqs,
    setFaqs,
    certificates,
    setCertificates,
    about,
    setAbout,
    contact,
    setContact,
    // Message management
    messages,
    oldMessages,
    messagesLoading,
    loadMessages,
    updateMessageStatus,
    archiveMessage,
    deleteMessage,
    // Other functions
    loading,
    saveAllToFirebase,
    saveHeroToFirebase
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};