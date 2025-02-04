import React from 'react';

function ParticipantDetails({
  participants,
  handleNumberInput,
  isManualTotal,
  setIsManualTotal,
  calculateAutoTotal,
  manualPackageAmount,
  setManualPackageAmount,
  setPackageAmount,
  validateNumberInput,
  includeGST,
  setIncludeGST,
  packageAmount,
  gstAmount,
  totalAmount
}) {
  return (
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
      <div className="text-right">
        <p className="text-lg">Package Amount: ₹{packageAmount.toLocaleString('en-IN')}</p>
        {includeGST && (
          <p className="text-md text-gray-600">GST (18%): ₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        )}
        <p className="text-xl font-bold">Total Amount: ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
    </div>
  );
}

export default ParticipantDetails;