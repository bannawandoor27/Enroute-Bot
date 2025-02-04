import React, { useState } from 'react';

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

  const loadSavedItems = () => {
    const savedInclusions = JSON.parse(localStorage.getItem('customInclusions') || '[]');
    const savedExclusions = JSON.parse(localStorage.getItem('customExclusions') || '[]');
    
    const mergedInclusions = [...defaultInclusions, ...savedInclusions];
    const mergedExclusions = [...defaultExclusions, ...savedExclusions];
    
    return {
      inclusions: mergedInclusions.map(item => ({ text: item, checked: true })),
      exclusions: mergedExclusions.map(item => ({ text: item, checked: true }))
    };
  };

  const initialState = loadSavedItems();
  const PlusIcon = window.HeroiconsOutline?.PlusIcon;
  const TrashIcon = window.HeroiconsOutline?.TrashIcon;

  const [days, setDays] = useState([{ activities: '', date: '' }]);
  const [packageAmount, setPackageAmount] = useState(0);
  const [includeGST, setIncludeGST] = useState(false);
  const [manualPackageAmount, setManualPackageAmount] = useState('');
  const [clientName, setClientName] = useState('');
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
    const newDay = { activities: '' };
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
            <p class="subtitle">Your Personalized Journey Plan</p>
          </div>

          ${days.map((day, index) => `
            <div class="day-container">
              <h2 class="day-title">Day ${index + 1}</h2>
              ${day.date ? `<p class="day-date">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
              <p class="day-activities">${day.activities || 'No activities planned'}</p>
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
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Client Name (Optional)"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                {days.map((day, index) => (
                  <div key={index} className="mb-6 p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-semibold">Day {index + 1}</h2>
                      <button
                        onClick={() => removeDay(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <input
                      type="date"
                      className="w-full p-2 border rounded mb-2"
                      value={day.date || ''}
                      onChange={(e) => updateDay(index, 'date', e.target.value)}
                    />
                    <textarea
                      className="w-full p-2 border rounded mb-2"
                      placeholder="Enter activities for this day"
                      value={day.activities}
                      onChange={(e) => updateDay(index, 'activities', e.target.value)}
                    />
                  </div>
                ))}
                <button
                  onClick={addDay}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Day
                </button>
                <div className="mt-4 p-4 border rounded-lg">
                  <div className="space-y-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Adults (10+)</label>
                        <input
                          type="text"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          className="w-full p-2 border rounded"
                          value={participants.adults.count}
                          onChange={(e) => handleNumberInput('adults', 'count', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adult Cost per Head</label>
                        <input
                          type="text"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          className="w-full p-2 border rounded"
                          value={participants.adults.costPerHead}
                          onChange={(e) => handleNumberInput('adults', 'costPerHead', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Children (5-10)</label>
                        <input
                          type="text"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          className="w-full p-2 border rounded"
                          value={participants.children.count}
                          onChange={(e) => handleNumberInput('children', 'count', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Child Cost per Head</label>
                        <input
                          type="text"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          className="w-full p-2 border rounded"
                          value={participants.children.costPerHead}
                          onChange={(e) => handleNumberInput('children', 'costPerHead', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Infants (under 5)</label>
                        <input
                          type="text"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          className="w-full p-2 border rounded"
                          value={participants.infants.count}
                          onChange={(e) => handleNumberInput('infants', 'count', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Infant Cost per Head</label>
                        <input
                          type="text"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          className="w-full p-2 border rounded"
                          value={participants.infants.costPerHead}
                          onChange={(e) => handleNumberInput('infants', 'costPerHead', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isManualTotal}
                        onChange={(e) => {
                          setIsManualTotal(e.target.checked);
                          if (!e.target.checked) {
                            setPackageAmount(calculateAutoTotal());
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Override calculated total</span>
                    </label>
                    <input
                      type="text"
                      className="w-48 p-2 border rounded"
                      placeholder="Enter package amount"
                      value={manualPackageAmount}
                      onChange={(e) => {
                        if (validateNumberInput(e.target.value)) {
                          setManualPackageAmount(e.target.value);
                          setPackageAmount(e.target.value === '' ? 0 : Number(e.target.value));
                        }
                      }}
                      disabled={!isManualTotal}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="includeGST"
                      checked={includeGST}
                      onChange={(e) => setIncludeGST(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="includeGST">Include GST (18%)</label>
                  </div>
                  
                  <div className="mb-6 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Package Inclusions</h3>
                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2">
                      {inclusions.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleInclusion(index)}
                            className="mr-2"
                          />
                          <span className={item.checked ? 'text-gray-900' : 'text-gray-500'}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 p-2 border rounded"
                        placeholder="Add new inclusion"
                        value={newInclusion}
                        onChange={(e) => setNewInclusion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addInclusion()}
                      />
                      <button
                        onClick={addInclusion}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="mb-6 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Package Exclusions</h3>
                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2">
                      {exclusions.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleExclusion(index)}
                            className="mr-2"
                          />
                          <span className={item.checked ? 'text-gray-900' : 'text-gray-500'}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 p-2 border rounded"
                        placeholder="Add new exclusion"
                        value={newExclusion}
                        onChange={(e) => setNewExclusion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addExclusion()}
                      />
                      <button
                        onClick={addExclusion}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg">Package Amount: ₹{packageAmount.toLocaleString('en-IN')}</p>
                    {includeGST && (
                      <p className="text-md text-gray-600">GST (18%): ₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    )}
                    <p className="text-xl font-bold">Total Amount: ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
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
