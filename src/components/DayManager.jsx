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
            type="text"
            className="w-full p-2 border rounded mb-2"
            placeholder="Day header (optional)"
            value={day.header || ''}
            onChange={(e) => updateDay(index, 'header', e.target.value)}
          />
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
          <select
            className="w-full p-2 border rounded"
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