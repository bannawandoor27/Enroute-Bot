import React, { useState, useEffect } from 'react';
import DayManager from './components/DayManager';
import ParticipantDetails from './components/ParticipantDetails';
import PackageDetails from './components/PackageDetails';

function App() {
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

  const loadSavedItems = () => {
    const savedInclusions = JSON.parse(localStorage.getItem('customInclusions') || '[]');
    const savedExclusions = JSON.parse(localStorage.getItem('customExclusions') || '[]');
    const savedTerms = JSON.parse(localStorage.getItem('customTerms') || '[]');
    
    const mergedInclusions = [...defaultInclusions, ...savedInclusions];
    const mergedExclusions = [...defaultExclusions, ...savedExclusions];
    const mergedTerms = [...defaultTerms, ...savedTerms];
    
    return {
      inclusions: mergedInclusions.map(item => ({ text: item, checked: true })),
      exclusions: mergedExclusions.map(item => ({ text: item, checked: true })),
      terms: mergedTerms.map(item => ({ text: item, checked: true }))
    };
  };

  const initialState = loadSavedItems();
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

  const addInclusion = () => {
    if (newInclusion.trim()) {
      const updatedInclusions = [...inclusions, { text: newInclusion.trim(), checked: true }];
      setInclusions(updatedInclusions);
      setNewInclusion('');
      
      const customInclusions = updatedInclusions
        .filter(item => !defaultInclusions.includes(item.text))
        .map(item => item.text);
      localStorage.setItem('customInclusions', JSON.stringify(customInclusions));
    }
  };

  const addTerm = () => {
    if (newTerm.trim()) {
      const updatedTerms = [...terms, { text: newTerm.trim(), checked: true }];
      setTerms(updatedTerms);
      setNewTerm('');
      
      const customTerms = updatedTerms
        .filter(item => !defaultTerms.includes(item.text))
        .map(item => item.text);
      localStorage.setItem('customTerms', JSON.stringify(customTerms));
    }
  };

  const toggleTerm = (index) => {
    const newTerms = terms.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    setTerms(newTerms);
  };

  const addExclusion = () => {
    if (newExclusion.trim()) {
      const updatedExclusions = [...exclusions, { text: newExclusion.trim(), checked: true }];
      setExclusions(updatedExclusions);
      setNewExclusion('');
      
      const customExclusions = updatedExclusions
        .filter(item => !defaultExclusions.includes(item.text))
        .map(item => item.text);
      localStorage.setItem('customExclusions', JSON.stringify(customExclusions));
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

  const loadTemplates = () => {
    const savedTemplates = JSON.parse(localStorage.getItem('packageTemplates') || '[]');
    setTemplates(savedTemplates);
  };

  const saveCurrentAsTemplate = () => {
    if (!location || !packageType) return;

    const templateName = `${location} - ${packageType}`;
    const templateData = {
      name: templateName,
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
    };

    const existingTemplates = JSON.parse(localStorage.getItem('packageTemplates') || '[]');
    const templateIndex = existingTemplates.findIndex(t => t.name === templateName);

    if (templateIndex >= 0) {
      existingTemplates[templateIndex] = templateData;
    } else {
      existingTemplates.push(templateData);
    }

    localStorage.setItem('packageTemplates', JSON.stringify(existingTemplates));
    setTemplates(existingTemplates);
  };

  const loadTemplate = (templateName) => {
    const template = templates.find(t => t.name === templateName);
    if (!template) return;

    setLocation(template.location);
    setPackageType(template.packageType);
    setDays(template.days.map(day => ({ ...day })));
    setParticipants({ ...template.participants });
    setInclusions(template.inclusions.map(item => ({ ...item })));
    setExclusions(template.exclusions.map(item => ({ ...item })));
    setTerms(template.terms.map(item => ({ ...item })));
    setIncludeGST(template.includeGST);
    setIsManualTotal(template.isManualTotal);
    setPackageAmount(template.packageAmount);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      loadTemplate(selectedTemplate);
    }
  }, [selectedTemplate]);

  const generatePrintableItinerary = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Travel Itinerary - ${clientName || 'Your Journey'}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; background-color: #ffffff; }
            .header { margin-bottom: 40px; border-bottom: 3px solid #14665e; padding-bottom: 15px; text-align: center; }
            .title { font-size: 32px; color: #14665e; font-weight: bold; margin: 0; letter-spacing: 0.5px; }
            .subtitle { font-size: 15px; color: rgba(20, 102, 94, 0.7); margin-top: 8px; }
            .day-container { margin-bottom: 25px; padding: 20px; background-color: rgba(20, 102, 94, 0.03); border-radius: 10px; border: 1px solid rgba(20, 102, 94, 0.1); }
            .day-title { font-size: 22px; color: #14665e; margin-bottom: 10px; font-weight: bold; letter-spacing: 0.3px; }
            .day-date { font-size: 15px; color: rgba(20, 102, 94, 0.8); margin-bottom: 15px; font-weight: 500; }
            .day-activities { font-size: 15px; color: #2c3e50; line-height: 1.8; }
            .amount-section { margin-top: 35px; padding: 25px; background-color: rgba(20, 102, 94, 0.05); border-radius: 12px; border: 1px solid rgba(20, 102, 94, 0.15); }
            .amount-title { font-size: 18px; color: #14665e; margin-bottom: 15px; font-weight: bold; letter-spacing: 0.3px; }
            .amount-detail { font-size: 16px; color: #2c3e50; margin-bottom: 10px; font-weight: 500; }
            .gst-details { font-size: 15px; color: rgba(20, 102, 94, 0.8); margin-bottom: 10px; }
            .total-amount { font-size: 20px; color: #14665e; margin-top: 15px; font-weight: bold; letter-spacing: 0.3px; }
            .footer { margin-top: 50px; border-top: 2px solid rgba(20, 102, 94, 0.1); padding-top: 25px; font-size: 13px; color: rgba(20, 102, 94, 0.6); text-align: center; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Travel Itinerary</h1>
            ${clientName ? `<p class="subtitle">Prepared for: ${clientName}</p>` : ''}
            ${packageType ? `<p class="subtitle">Package Type: ${packageType}</p>` : ''}
            ${location ? `<p class="subtitle">Location: ${location}</p>` : ''}
            <p class="subtitle">Your Personalized Journey Plan</p>
          </div>

          ${days.map((day, index) => `
            <div class="day-container">
              <h2 class="day-title">Day ${index + 1}${day.header ? `: ${day.header}` : ''}</h2>
              ${day.date ? `<p class="day-date">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
              <p class="day-activities">${day.activities || 'No activities planned'}</p>
              <p class="day-meal-plan" style="color: #14665e; font-size: 15px; margin-top: 10px;">Meal Plan: ${
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

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-2xl font-bold mb-8 text-center">Travel Itinerary Generator</h1>
                <div className="mb-6">
                  <div className="flex gap-2 mb-4">
                    <select
                      className="flex-1 p-2 border rounded"
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
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      disabled={!location || !packageType}
                    >
                      Save as Template
                    </button>
                  </div>
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Client Name (Optional)"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Package Type (e.g., Honeymoon, Family, Adventure)"
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-2"
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
                <div className="mt-6">
                  <button
                    onClick={generatePrintableItinerary}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Generate Printable Itinerary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
