import React from 'react';

function DayManager({ days, updateDay, removeDay, addDay, PlusIcon, TrashIcon }) {
  const mealPlanOptions = [
    { value: 'none', label: 'No Meals' },
    { value: 'breakfast', label: 'Breakfast Only' },
    { value: 'breakfast_dinner', label: 'Breakfast & Dinner' },
    { value: 'all_meals', label: 'All Meals (B+L+D)' },
    { value: 'dinner', label: 'Dinner Only' }
  ];
  return (
    <div>
      {days.map((day, index) => (
        <div key={index} className="mb-8 p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-playfair font-bold text-gray-800">Day {index + 1}</h2>
            <button
              onClick={() => removeDay(index)}
              className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-full"
              title="Remove Day"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          <input
            type="text"
            className="w-full p-3 border border-gray-200 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70"
            placeholder="Day header (optional)"
            value={day.header || ''}
            onChange={(e) => updateDay(index, 'header', e.target.value)}
          />
          <input
            type="date"
            className="w-full p-3 border border-gray-200 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70"
            value={day.date || ''}
            onChange={(e) => updateDay(index, 'date', e.target.value)}
          />
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 min-h-[100px]"
            placeholder="Enter activities for this day"
            value={day.activities}
            onChange={(e) => updateDay(index, 'activities', e.target.value)}
          />
          <select
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70"
            value={day.mealPlan || 'none'}
            onChange={(e) => updateDay(index, 'mealPlan', e.target.value)}
          >
            {mealPlanOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button
        onClick={addDay}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Day
      </button>
    </div>
  );
}

export default DayManager;