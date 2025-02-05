import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { getUser } from '../auth';

const getPackageDates = (itinerary) => {
  if (!itinerary?.itinerary_data?.days || itinerary.itinerary_data.days.length === 0) {
    return 'N/A';
  }

  const dates = itinerary.itinerary_data.days
    .map(day => day.date)
    .filter(date => date) // Remove empty dates
    .sort();

  if (dates.length === 0) {
    return 'N/A';
  }

  const startDate = new Date(dates[0]);
  const endDate = new Date(dates[dates.length - 1]);

  return `${startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })} - ${endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })}`;
};

function ItineraryList({ onCreateNew }) {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const user = getUser();

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('itineraries').select('*');
      
      // If not admin, filter by username
      if (user.username !== 'admin') {
        query = query.eq('username', user.username);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setItineraries(data || []);
    } catch (err) {
      console.error('Error loading itineraries:', err);
      setError('Failed to load itineraries');
    } finally {
      setLoading(false);
    }
  };

  const filteredItineraries = itineraries.filter(itinerary => {
    const searchLower = searchQuery.toLowerCase();
    return (
      itinerary.booking_code.toLowerCase().includes(searchLower) ||
      (itinerary.itinerary_data.clientName || '').toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="text-teal-600">Loading itineraries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const handleDelete = async (itinerary) => {
    setSelectedItinerary(itinerary);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('itineraries')
        .delete()
        .eq('id', selectedItinerary.id);

      if (error) throw error;

      setItineraries(itineraries.filter(i => i.id !== selectedItinerary.id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting itinerary:', err);
      setError('Failed to delete itinerary');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-teal-50">
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this itinerary? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Itineraries</h1>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Create New Itinerary
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name or booking code..."
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto relative">
            <table className="min-w-full divide-y divide-gray-200 table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Booking Code</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Client Name</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Package Type</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Location</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Brand</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Status</th>
                  {user.username === 'admin' && (
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Created By</th>
                  )}
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">Created At</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">Package Dates</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItineraries.map((itinerary) => (
                  <tr key={itinerary.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{itinerary.booking_code}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{itinerary.itinerary_data.clientName || 'N/A'}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{itinerary.itinerary_data.packageType || 'N/A'}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{itinerary.itinerary_data.location || 'N/A'}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{itinerary.brand}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{itinerary.booking_status}</td>
                    {user.username === 'admin' && (
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{itinerary.username}</td>
                    )}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(itinerary.created_at)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPackageDates(itinerary)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.currentTarget.nextElementSibling.classList.toggle('hidden');
                          }}
                          className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        <div className="hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <button
                              onClick={() => handleDelete(itinerary)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              role="menuitem"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {itineraries.length > 0 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Previous
              </button>
              <span className="px-4 py-1 text-sm text-gray-600">
                Page {currentPage} of {pageCount}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(pageCount, prev + 1))}
                disabled={currentPage === pageCount}
                className={`px-3 py-1 rounded-md ${currentPage === pageCount ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(pageCount)}
                disabled={currentPage === pageCount}
                className={`px-3 py-1 rounded-md ${currentPage === pageCount ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Last
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItineraryList;