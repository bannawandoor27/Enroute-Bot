import React from 'react';

function PackageDetails({
  inclusions,
  exclusions,
  toggleInclusion,
  toggleExclusion,
  newInclusion,
  setNewInclusion,
  newExclusion,
  setNewExclusion,
  addInclusion,
  addExclusion,
  terms,
  toggleTerm,
  newTerm,
  setNewTerm,
  addTerm
}) {
  return (
    <div>
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

      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Terms and Conditions</h3>
        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2">
          {terms.map((item, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleTerm(index)}
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
            placeholder="Add new term"
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTerm()}
          />
          <button
            onClick={addTerm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default PackageDetails;