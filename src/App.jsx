import React, { useState, useEffect } from 'react';
import DayManager from './components/DayManager';
import ParticipantDetails from './components/ParticipantDetails';
import PackageDetails from './components/PackageDetails';
import Login from './components/Login';
import { supabase } from './supabaseClient';
import { authenticateUser, isAuthenticated, logout, getUser } from './auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };
  const defaultInclusions = [
    'Hotel Accommodation',
    'Breakfast',
    'Airport Transfers',
    'Sightseeing as per itinerary',
    'Tour Guide'
  ];

  const defaultExclusions = [
    'Airfare',
    'Lunch and Dinner',
    'Entry Fees',
    'Personal Expenses',
    'Travel Insurance'
  ];

  const defaultTerms = [
    'Cancellation charges will be applicable as per policy',
    'Prices are subject to change without prior notice',
    'Rooms are subject to availability',
    'Early check-in and late check-out are subject to availability',
    'Government issued photo ID is mandatory for check-in'
  ];

  const loadSavedItems = async () => {
    let savedInclusions = [];
    let savedExclusions = [];
    let savedTerms = [];

    try {
      const { data: inclusionsData, error: inclusionsError } = await supabase
        .from('custom_inclusions')
        .select('text');

      const { data: exclusionsData, error: exclusionsError } = await supabase
        .from('custom_exclusions')
        .select('text');

      const { data: termsData, error: termsError } = await supabase
        .from('custom_terms')
        .select('text');

      if (inclusionsError) throw inclusionsError;
      if (exclusionsError) throw exclusionsError;
      if (termsError) throw termsError;

      savedInclusions = inclusionsData?.map(item => item.text) || [];
      savedExclusions = exclusionsData?.map(item => item.text) || [];
      savedTerms = termsData?.map(item => item.text) || [];
    } catch (error) {
      console.error('Error loading saved items:', error);
      // Use default values if there's an error
      savedInclusions = [];
      savedExclusions = [];
      savedTerms = [];
    }

    const mergedInclusions = [...new Set([...defaultInclusions, ...savedInclusions])];
    const mergedExclusions = [...new Set([...defaultExclusions, ...savedExclusions])];
    const mergedTerms = [...new Set([...defaultTerms, ...savedTerms])];

    setInclusions(mergedInclusions.map(item => ({ text: item, checked: true })));
    setExclusions(mergedExclusions.map(item => ({ text: item, checked: true })));
    setTerms(mergedTerms.map(item => ({ text: item, checked: true })));

    return {
      inclusions: mergedInclusions.map(item => ({ text: item, checked: true })),
      exclusions: mergedExclusions.map(item => ({ text: item, checked: true })),
      terms: mergedTerms.map(item => ({ text: item, checked: true }))
    };
  };

  const [initialState, setInitialState] = useState({
    inclusions: defaultInclusions.map(item => ({ text: item, checked: true })),
    exclusions: defaultExclusions.map(item => ({ text: item, checked: true })),
    terms: defaultTerms.map(item => ({ text: item, checked: true }))
  });

  useEffect(() => {
    loadSavedItems().then(state => setInitialState(state));
  }, []);
  const PlusIcon = window.HeroiconsOutline?.PlusIcon;
  const TrashIcon = window.HeroiconsOutline?.TrashIcon;

  const [days, setDays] = useState([{ activities: '', date: '', mealPlan: 'none', header: '' }]);
  const [packageAmount, setPackageAmount] = useState(0);
  const [includeGST, setIncludeGST] = useState(false);
  const [manualPackageAmount, setManualPackageAmount] = useState('');
  const [clientName, setClientName] = useState('');
  const [packageType, setPackageType] = useState('');
  const [location, setLocation] = useState('');
  const [participants, setParticipants] = useState({
    adults: { count: 0, costPerHead: 0 },
    children: { count: 0, costPerHead: 0 },
    infants: { count: 0, costPerHead: 0 }
  });
  const [isManualTotal, setIsManualTotal] = useState(false);
  const [inclusions, setInclusions] = useState(initialState.inclusions);
  const [exclusions, setExclusions] = useState(initialState.exclusions);
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [terms, setTerms] = useState(initialState.terms);
  const [newTerm, setNewTerm] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const addInclusion = async () => {
    if (newInclusion.trim()) {
      const newInclusionText = newInclusion.trim();
      const updatedInclusions = [...inclusions, { text: newInclusionText, checked: true }];
      
      try {
        const { error } = await supabase
          .from('custom_inclusions')
          .insert([{ text: newInclusionText }]);

        if (error) throw error;
        
        setInclusions(updatedInclusions);
        setNewInclusion('');
      } catch (error) {
        console.error('Error adding inclusion:', error);
      }
    }
  };

  const addTerm = async () => {
    if (newTerm.trim()) {
      const newTermText = newTerm.trim();
      const updatedTerms = [...terms, { text: newTermText, checked: true }];
      
      try {
        const { error } = await supabase
          .from('custom_terms')
          .insert([{ text: newTermText }]);

        if (error) throw error;
        
        setTerms(updatedTerms);
        setNewTerm('');
      } catch (error) {
        console.error('Error adding term:', error);
      }
    }
  };

  const toggleTerm = (index) => {
    const newTerms = terms.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    setTerms(newTerms);
  };

  const addExclusion = async () => {
    if (newExclusion.trim()) {
      const newExclusionText = newExclusion.trim();
      const updatedExclusions = [...exclusions, { text: newExclusionText, checked: true }];
      
      try {
        const { error } = await supabase
          .from('custom_exclusions')
          .insert([{ text: newExclusionText }]);

        if (error) throw error;
        
        setExclusions(updatedExclusions);
        setNewExclusion('');
      } catch (error) {
        console.error('Error adding exclusion:', error);
      }
    }
  };

  const toggleInclusion = (index) => {
    const newInclusions = inclusions.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    setInclusions(newInclusions);
  };

  const toggleExclusion = (index) => {
    const newExclusions = exclusions.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    setExclusions(newExclusions);
  };


  const validateNumberInput = (value) => {
    return value === '' || /^\d*$/.test(value);
  };

  const handleNumberInput = (category, field, value) => {
    if (validateNumberInput(value)) {
      updateParticipants(category, field, value);
    }
  };

  const addDay = () => {
    const lastDay = days[days.length - 1];
    const newDay = { activities: '', mealPlan: 'none', header: '' };
    if (lastDay.date) {
      const nextDate = new Date(lastDay.date);
      nextDate.setDate(nextDate.getDate() + 1);
      newDay.date = nextDate.toISOString().split('T')[0];
    }
    setDays([...days, newDay]);
  };

  const removeDay = (index) => {
    const newDays = days.filter((_, i) => i !== index);
    setDays(newDays);
  };

  const updateDay = (index, field, value) => {
    const newDays = days.map((day, i) => {
      if (i === index) {
        return { ...day, [field]: value };
      }
      if (field === 'date' && i > index) {
        const prevDate = new Date(value);
        prevDate.setDate(prevDate.getDate() + (i - index));
        return { ...day, date: prevDate.toISOString().split('T')[0] };
      }
      return day;
    });
    setDays(newDays);
  };

  const calculateAutoTotal = () => {
    const { adults, children, infants } = participants;
    if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (adults.count * adults.costPerHead) +
           (children.count * children.costPerHead) +
           (infants.count * infants.costPerHead);
  };

  const updateParticipants = (category, field, value) => {
    const newParticipants = {
      ...participants,
      [category]: {
        ...participants[category],
        [field]: Number(value)
      }
    };
    setParticipants(newParticipants);
    if (!isManualTotal) {
      const newTotal = (newParticipants.adults.count * newParticipants.adults.costPerHead) +
                      (newParticipants.children.count * newParticipants.children.costPerHead) +
                      (newParticipants.infants.count * newParticipants.infants.costPerHead);
      setPackageAmount(newTotal);
    }
  };

  const gstRate = 0.18; // 18% GST
  const gstAmount = includeGST ? packageAmount * gstRate : 0;
  const totalAmount = packageAmount + gstAmount;

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('package_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates([]);
    }
  };

  const saveCurrentAsTemplate = async () => {
    if (!location || !packageType) return;

    const templateName = `${location} - ${packageType}`;
    const templateData = {
      name: templateName,
      data: {
        location,
        packageType,
        days,
        participants,
        inclusions: inclusions.map(item => ({ ...item })),
        exclusions: exclusions.map(item => ({ ...item })),
        terms: terms.map(item => ({ ...item })),
        includeGST,
        isManualTotal,
        packageAmount
      }
    };

    try {
      const { error: upsertError } = await supabase
        .from('package_templates')
        .upsert(templateData, { onConflict: 'name' });

      if (upsertError) throw upsertError;

      // Refresh templates list
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const loadTemplate = (templateName) => {
    const template = templates.find(t => t.name === templateName);
    if (!template || !template.data) return;

    const { data } = template;
    setLocation(data.location);
    setPackageType(data.packageType);
    setDays(data.days.map(day => ({ ...day })));
    setParticipants({ ...data.participants });
    setInclusions(data.inclusions.map(item => ({ ...item })));
    setExclusions(data.exclusions.map(item => ({ ...item })));
    setTerms(data.terms.map(item => ({ ...item })));
    setIncludeGST(data.includeGST);
    setIsManualTotal(data.isManualTotal);
    setPackageAmount(data.packageAmount);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      loadTemplate(selectedTemplate);
    }
  }, [selectedTemplate]);

  const generateBookingCode = (brand) => {
    const prefix = brand === 'enroute' ? 'E' : 'B';
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 12);
    const randomChars = Math.random().toString(36).toUpperCase().slice(2, 6);
    return `${prefix}${timestamp}${randomChars}`;
  };

  const generatePrintableItinerary = async (brand) => {
    const bookingCode = generateBookingCode(brand);
    const user = getUser();
    
    // Save itinerary data to Supabase
    try {
      const itineraryData = {
        booking_code: bookingCode,
        username: user.username,
        brand,
        itinerary_data: {
          clientName,
          packageType,
          location,
          days,
          participants,
          inclusions: inclusions.filter(item => item.checked),
          exclusions: exclusions.filter(item => item.checked),
          terms: terms.filter(item => item.checked),
          packageAmount,
          includeGST,
          gstAmount,
          totalAmount
        }
      };

      const { error } = await supabase
        .from('itineraries')
        .insert([itineraryData]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving itinerary:', error);
    }

    const printWindow = window.open('', '_blank');
    const logoPath = brand === 'enroute' ? 'https://res.cloudinary.com/dozsrgs3w/image/upload/v1738656618/ynvxcvfd6r8o5ibh8ru6.png' : 'https://res.cloudinary.com/dozsrgs3w/image/upload/v1738656617/nfaomnqwjpq2wxr4fb2a.png';
    const themeColor = brand === 'enroute' ? '#14665e' : '#0560C7';
    printWindow.document.write(`
      <html>
        <head>
          <title>Travel Itinerary - ${clientName || 'Your Journey'}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 10px; max-width: 750px; margin: 0 auto; background-color: #ffffff; color: #2c3e50; line-height: 1.3; }
            .header { margin-bottom: 15px; position: relative; padding: 10px 0; text-align: center; background: linear-gradient(135deg, ${themeColor}0A, ${themeColor}16); border-radius: 8px; box-shadow: 0 2px 8px ${themeColor}0F; }
            .logo { max-width: 150px; margin: 0 auto 15px; display: block; }
            .title { font-family: 'Playfair Display', serif; font-size: 28px; color: ${themeColor}; font-weight: 700; margin: 0; letter-spacing: -0.3px; text-shadow: 1px 1px 2px ${themeColor}1A; position: relative; }
            .title:after { content: ''; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 40px; height: 2px; background: linear-gradient(to right, transparent, ${themeColor}, transparent); }
            .subtitle { font-size: 13px; color: #2c3e50; margin-top: 12px; font-weight: 500; letter-spacing: 0.2px; }
            .day-container { margin-bottom: 12px; padding: 12px; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 4px ${themeColor}0D; border: 1px solid ${themeColor}14; }
            .day-title { font-family: 'Playfair Display', serif; font-size: 18px; color: ${themeColor}; margin-bottom: 6px; font-weight: 700; letter-spacing: -0.2px; }
            .day-date { font-size: 13px; color: #2c3e50; margin-bottom: 8px; font-weight: 500; opacity: 0.9; border-bottom: 1px solid ${themeColor}14; padding-bottom: 6px; }
            .day-activities { font-size: 13px; color: #2c3e50; line-height: 1.4; padding: 0; }
            .amount-section { margin-top: 20px; padding: 15px; background: linear-gradient(165deg, #ffffff, ${themeColor}0A); border-radius: 8px; box-shadow: 0 1px 6px ${themeColor}0F; }
            .amount-title { font-family: 'Playfair Display', serif; font-size: 18px; color: ${themeColor}; margin-bottom: 12px; font-weight: 700; letter-spacing: -0.2px; position: relative; padding-bottom: 6px; }
            .amount-detail { font-size: 14px; color: #2c3e50; margin-bottom: 6px; font-weight: 600; letter-spacing: 0.1px; }
            .gst-details { font-size: 13px; color: #2c3e50; margin-bottom: 6px; font-weight: 500; padding: 4px 0; border-bottom: 1px dashed ${themeColor}1F; }
            .total-amount { font-size: 18px; color: ${themeColor}; margin-top: 12px; font-weight: 700; letter-spacing: -0.2px; padding: 10px; background: ${themeColor}0A; border-radius: 6px; text-align: right; }
            .footer { margin-top: 20px; padding-top: 15px; font-size: 12px; color: #2c3e50; text-align: center; position: relative; }
            ul { padding-left: 12px; margin: 8px 0; }
            li { margin-bottom: 4px; position: relative; padding-left: 2px; line-height: 1.4; }
            @media print { 
              body { padding: 10px; }
              .day-container, .amount-section { margin-bottom: 10px; padding: 10px; }
              @page { margin: 0; size: auto; }
              @page :first { margin-top: 0; }
              @page :left { margin-left: 0; }
              @page :right { margin-right: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoPath}" alt="Brand Logo" class="logo" />
            <h1 class="title">Travel Itinerary</h1>
            ${clientName ? `<p class="subtitle">Guest name: ${clientName}</p>` : ''}
            ${packageType ? `<p class="subtitle">Package Type: ${packageType}</p>` : ''}
            ${location ? `<p class="subtitle">Location: ${location}</p>` : ''}
            <p class="subtitle">Total Guests: ${participants.adults.count + participants.children.count + participants.infants.count} (${participants.adults.count} Adults, ${participants.children.count} Children, ${participants.infants.count} Infants)</p>
            <p class="subtitle">Your Personalized Journey Plan</p>
          </div>

          ${days.map((day, index) => `
            <div class="day-container">
              <h2 class="day-title">Day ${index + 1}${day.header ? `: ${day.header}` : ''}</h2>
              ${day.date ? `<p class="day-date">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
              <p class="day-activities">${day.activities || 'No activities planned'}</p>
              <p class="day-meal-plan" style="color: ${themeColor}; font-size: 15px; margin-top: 10px;">Meal Plan: ${
                {
                  'none': 'No Meals ',
                  'breakfast': 'Breakfast ',
                  'breakfast_dinner': 'Breakfast & Dinner ',
                  'all_meals': 'All Meals  (B+L+D)',
                  'dinner': 'Dinner '
                }[day.mealPlan] || 'No Meals '
              }</p>
            </div>
          `).join('')}

          <div class="amount-section">
            <h3 class="amount-title">Package Details</h3>
            <div class="mb-4">
              <h4 class="text-lg font-semibold text-teal-800 mb-2">Inclusions:</h4>
              <ul class="list-disc pl-5 space-y-1">
                ${inclusions.filter(item => item.checked).map(item => `
                  <li class="text-gray-700">${item.text}</li>
                `).join('')}
              </ul>
            </div>
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-teal-800 mb-2">Exclusions:</h4>
              <ul class="list-disc pl-5 space-y-1">
                ${exclusions.filter(item => item.checked).map(item => `
                  <li class="text-gray-700">${item.text}</li>
                `).join('')}
              </ul>
            </div>
            <h3 class="amount-title mt-8">Financial Details</h3>
            <p class="amount-detail">Per Person Charges:</p>
            <p class="gst-details">Adults (10+): ${participants.adults.count} × ₹${participants.adults.costPerHead.toLocaleString('en-IN')} = ₹${(participants.adults.count * participants.adults.costPerHead).toLocaleString('en-IN')}</p>
            <p class="gst-details">Children (5-10): ${participants.children.count} × ₹${participants.children.costPerHead.toLocaleString('en-IN')} = ₹${(participants.children.count * participants.children.costPerHead).toLocaleString('en-IN')}</p>
            <p class="gst-details">Infants (under 5): ${participants.infants.count} × ₹${participants.infants.costPerHead.toLocaleString('en-IN')} = ₹${(participants.infants.count * participants.infants.costPerHead).toLocaleString('en-IN')}</p>
            <p class="amount-detail">Package Amount: ₹${packageAmount.toLocaleString('en-IN')}</p>
            ${includeGST ? `<p class="gst-details">GST (18%): ₹${gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>` : ''}
            <p class="total-amount">Total Amount: ₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>

          <div class="terms-section">
            <h3 class="amount-title mt-8">Terms and Conditions</h3>
            <ul class="list-disc pl-5 space-y-2">
              ${terms.filter(item => item.checked).map(item => `
                <li class="text-gray-700">${item.text}</li>
              `).join('')}
            </ul>
          </div>

          <div class="footer">
            <p>Thank you for choosing our travel services. We wish you a pleasant journey!</p>
          </div>

          <script>
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!PlusIcon || !TrashIcon) {
    return <div>Loading icons...</div>;
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-4 sm:py-8 px-4 sm:px-6 flex flex-col justify-between">
      <div className="w-full max-w-4xl mx-auto">
        <div className="px-4 sm:px-6 py-6 sm:py-10 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl sm:rounded-3xl border border-white/20">
          <div className="w-full max-w-3xl mx-auto">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6 text-gray-700">
                <div className="text-center space-y-2 relative px-2 sm:px-0 mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-playfair mb-2 pt-2">Travel Itinerary Generator</h1>
                  <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mx-auto">Create beautiful, professional travel itineraries with ease</p>
                </div>
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <select
                      className="flex-1 p-2 border rounded text-sm"
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                    >
                      <option value="">Select a template</option>
                      {templates.map(template => (
                        <option key={template.name} value={template.name}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={saveCurrentAsTemplate}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm whitespace-nowrap"
                      disabled={!location || !packageType}
                    >
                      Save as Template
                    </button>
                  </div>
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-2 text-sm"
                    placeholder="Client Name (Optional)"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-2 text-sm"
                    placeholder="Package Type (e.g., Honeymoon, Family, Adventure)"
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-2 text-sm"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <DayManager
                  days={days}
                  updateDay={updateDay}
                  removeDay={removeDay}
                  addDay={addDay}
                  PlusIcon={PlusIcon}
                  TrashIcon={TrashIcon}
                />
                <ParticipantDetails
                  participants={participants}
                  handleNumberInput={handleNumberInput}
                  isManualTotal={isManualTotal}
                  setIsManualTotal={setIsManualTotal}
                  calculateAutoTotal={calculateAutoTotal}
                  manualPackageAmount={manualPackageAmount}
                  setManualPackageAmount={setManualPackageAmount}
                  setPackageAmount={setPackageAmount}
                  validateNumberInput={validateNumberInput}
                  includeGST={includeGST}
                  setIncludeGST={setIncludeGST}
                  packageAmount={packageAmount}
                  gstAmount={gstAmount}
                  totalAmount={totalAmount}
                />
                <PackageDetails
                  inclusions={inclusions}
                  exclusions={exclusions}
                  toggleInclusion={toggleInclusion}
                  toggleExclusion={toggleExclusion}
                  newInclusion={newInclusion}
                  setNewInclusion={setNewInclusion}
                  newExclusion={newExclusion}
                  setNewExclusion={setNewExclusion}
                  addInclusion={addInclusion}
                  addExclusion={addExclusion}
                  terms={terms}
                  toggleTerm={toggleTerm}
                  newTerm={newTerm}
                  setNewTerm={setNewTerm}
                  addTerm={addTerm}
                />
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => generatePrintableItinerary('enroute')}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Generate Enroute Itinerary
                  </button>
                  <button
                    onClick={() => generatePrintableItinerary('backpack')}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Generate Backpack Itinerary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto mt-8 flex justify-end">
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-lg transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;
