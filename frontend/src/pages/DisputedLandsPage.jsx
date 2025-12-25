import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons by dispute type
const markerIcons = {
  refugee_claim: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  muhajireen_claim: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  redistributed: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  overlapping_ownership: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  inheritance: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
};

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

const DisputedLandsPage = () => {
  const [disputedLands, setDisputedLands] = useState([]);
  const [stats, setStats] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLand, setSelectedLand] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mapCenter, setMapCenter] = useState([30.3753, 69.3451]); // Default: Pakistan center
  
  // Filters
  const [filters, setFilters] = useState({
    district: '',
    tehsil: '',
    dispute_type: '',
    dispute_status: ''
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // View mode
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'

  // Fetch stats
  useEffect(() => {
    fetchStats();
    fetchDistricts();
  }, []);

  // Fetch disputed lands
  useEffect(() => {
    fetchDisputedLands();
  }, [filters, page]);

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/disputed-lands/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchDistricts = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/disputed-lands/districts`);
      if (response.ok) {
        const data = await response.json();
        setDistricts(data.districts || []);
      }
    } catch (err) {
      console.error('Error fetching districts:', err);
    }
  };

  const fetchTehsils = async (district) => {
    if (!district) {
      setTehsils([]);
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/disputed-lands/tehsils?district=${encodeURIComponent(district)}`);
      if (response.ok) {
        const data = await response.json();
        setTehsils(data.tehsils || []);
      }
    } catch (err) {
      console.error('Error fetching tehsils:', err);
    }
  };

  const fetchDisputedLands = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '50',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      });

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/disputed-lands?${params}`);
      if (response.ok) {
        const data = await response.json();
        setDisputedLands(data.lands || []);
        setTotalPages(data.total_pages || 1);
      } else {
        setError('Failed to fetch disputed lands');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page
    
    if (key === 'district') {
      fetchTehsils(value);
      if (value === '') {
        setFilters(prev => ({ ...prev, tehsil: '' }));
      }
    }
  };

  const handleLandClick = async (landId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/disputed-lands/${landId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedLand(data);
        setShowModal(true);
        if (data.latitude && data.longitude) {
          setMapCenter([data.latitude, data.longitude]);
        }
      }
    } catch (err) {
      console.error('Error fetching land details:', err);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      under_investigation: 'bg-blue-500',
      court_hearing: 'bg-orange-500',
      resolved: 'bg-green-500',
      rejected: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getDisputeTypeLabel = (type) => {
    const labels = {
      refugee_claim: 'Refugee Claim',
      muhajireen_claim: 'Muhajireen Claim',
      redistributed: 'Redistributed Land',
      overlapping_ownership: 'Overlapping Ownership',
      inheritance: 'Inheritance Dispute'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Disputed Lands Registry</h1>
          <p className="text-gray-600">
            Managing land disputes including refugee claims, muhajireen settlements, and overlapping ownership
          </p>
        </div>

        {/* Stats Dashboard */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-3xl font-bold text-gray-800">{stats.total_disputes}</div>
              <div className="text-sm text-gray-600">Total Disputes</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-3xl font-bold text-yellow-600">{stats.by_status?.pending || 0}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-3xl font-bold text-orange-600">{stats.by_status?.court_hearing || 0}</div>
              <div className="text-sm text-gray-600">In Court</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-3xl font-bold text-green-600">{stats.by_status?.resolved || 0}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-3xl font-bold text-red-600">{stats.partition_impacted_count || 0}</div>
              <div className="text-sm text-gray-600">Partition Impact</div>
            </div>
          </div>
        )}

        {/* View Toggle and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === 'map' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🗺️ Map View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === 'list' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📋 List View
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>

              <select
                value={filters.tehsil}
                onChange={(e) => handleFilterChange('tehsil', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                disabled={!filters.district}
              >
                <option value="">All Tehsils</option>
                {tehsils.map(tehsil => (
                  <option key={tehsil} value={tehsil}>{tehsil}</option>
                ))}
              </select>

              <select
                value={filters.dispute_type}
                onChange={(e) => handleFilterChange('dispute_type', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Types</option>
                <option value="refugee_claim">Refugee Claim</option>
                <option value="muhajireen_claim">Muhajireen Claim</option>
                <option value="redistributed">Redistributed Land</option>
                <option value="overlapping_ownership">Overlapping Ownership</option>
                <option value="inheritance">Inheritance Dispute</option>
              </select>

              <select
                value={filters.dispute_status}
                onChange={(e) => handleFilterChange('dispute_status', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_investigation">Under Investigation</option>
                <option value="court_hearing">Court Hearing</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Legend */}
          {viewMode === 'map' && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                <span>Refugee Claim</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
                <span>Muhajireen Claim</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                <span>Redistributed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
                <span>Overlapping Ownership</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                <span>Inheritance</span>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Map View */}
        {viewMode === 'map' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading map data...</p>
                </div>
              </div>
            ) : (
              <MapContainer 
                center={mapCenter} 
                zoom={6} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapRecenter center={mapCenter} />
                {disputedLands
                  .filter(land => land.latitude && land.longitude)
                  .map(land => (
                    <Marker
                      key={land.id}
                      position={[land.latitude, land.longitude]}
                      icon={markerIcons[land.dispute_type] || markerIcons.overlapping_ownership}
                      eventHandlers={{
                        click: () => handleLandClick(land.id)
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <div className="font-bold">{land.mauza}</div>
                          <div className="text-xs text-gray-600">Khasra: {land.khasra_number}</div>
                          <div className="text-xs">{getDisputeTypeLabel(land.dispute_type)}</div>
                          <button
                            onClick={() => handleLandClick(land.id)}
                            className="mt-2 text-blue-600 hover:underline text-xs"
                          >
                            View Details →
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            )}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading disputed lands...</p>
                </div>
              </div>
            ) : disputedLands.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No disputed lands found matching the filters
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Khasra
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dispute Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Claimants
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Area
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {disputedLands.map(land => (
                        <tr key={land.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{land.mauza}</div>
                            <div className="text-xs text-gray-500">{land.tehsil}, {land.district}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {land.khasra_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{getDisputeTypeLabel(land.dispute_type)}</span>
                            {land.partition_impact && (
                              <div className="text-xs text-red-600 mt-1">⚠️ Partition Impact</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getStatusBadgeColor(land.dispute_status)}`}>
                              {land.dispute_status?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {land.claimants?.length || 0} claimant(s)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {land.area_kanal && `${land.area_kanal}K`}
                            {land.area_marla && `-${land.area_marla}M`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleLandClick(land.id)}
                              className="text-green-600 hover:text-green-900 font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                      Page {page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedLand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Disputed Land Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Location</h3>
                    <p className="text-lg">{selectedLand.mauza}</p>
                    <p className="text-sm text-gray-600">{selectedLand.tehsil}, {selectedLand.district}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Khasra Number</h3>
                    <p className="text-lg">{selectedLand.khasra_number}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Area</h3>
                    <p className="text-lg">
                      {selectedLand.area_kanal && `${selectedLand.area_kanal} Kanal`}
                      {selectedLand.area_marla && ` ${selectedLand.area_marla} Marla`}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Dispute Type</h3>
                    <p className="text-lg">{getDisputeTypeLabel(selectedLand.dispute_type)}</p>
                    {selectedLand.partition_impact && (
                      <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                        ⚠️ Partition Impact (1947)
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Status</h3>
                    <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full text-white ${getStatusBadgeColor(selectedLand.dispute_status)}`}>
                      {selectedLand.dispute_status?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {selectedLand.historical_owner && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Historical Owner</h3>
                      <p className="text-lg">{selectedLand.historical_owner}</p>
                    </div>
                  )}

                  {selectedLand.claimants && selectedLand.claimants.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">Claimants ({selectedLand.claimants.length})</h3>
                      <div className="space-y-2">
                        {selectedLand.claimants.map((claimant, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            <p className="font-medium">{claimant.name}</p>
                            <p className="text-sm text-gray-600">CNIC: {claimant.cnic}</p>
                            {claimant.contact && (
                              <p className="text-sm text-gray-600">Contact: {claimant.contact}</p>
                            )}
                            {claimant.relationship && (
                              <p className="text-sm text-gray-600">Relationship: {claimant.relationship}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedLand.case_number && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Case Information</h3>
                      <p className="text-sm">Case #: {selectedLand.case_number}</p>
                      {selectedLand.court_jurisdiction && (
                        <p className="text-sm">Court: {selectedLand.court_jurisdiction}</p>
                      )}
                      {selectedLand.filed_date && (
                        <p className="text-sm">Filed: {new Date(selectedLand.filed_date).toLocaleDateString()}</p>
                      )}
                      {selectedLand.next_hearing_date && (
                        <p className="text-sm text-orange-600 font-medium">
                          Next Hearing: {new Date(selectedLand.next_hearing_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {selectedLand.notes && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Notes</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedLand.notes}</p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DisputedLandsPage;
