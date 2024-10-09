import React, { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';
import '../styles/Workout.css';

const url_api = "https://fitnessapp-api-ln8u.onrender.com"

function Workout() {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');

  const fetchWorkouts = useCallback(async () => {
    if (!user || !user.token) return;
    try {
      const response = await axios.get(`${url_api}/workouts/getMyWorkouts`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setWorkouts(response.data.workouts || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Could not fetch workouts. Please try again later.');
    }
  }, [user]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    if (!user || !user.token) return;
    try {
      const response = await axios.post(`${url_api}/workouts/addWorkout`,
        { name, duration },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response) {
        setName('');
        setDuration('');
        setShowForm(false);
        fetchWorkouts();
      }
    } catch (error) {
      console.error('Error adding workout:', error);
      setError('Could not add workout. Please try again later.');
    }
  };

  // Redirect to Home if the user is not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">My Workouts</h1>
      {error && <p className="text-danger text-center">{error}</p>}
      <button className="btn btn-primary my-3 d-block mx-auto" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Close Workout Form' : 'Add Workout'}
      </button>

      {showForm && (
        <form onSubmit={handleAddWorkout} className="mb-4 workout-form shadow p-4 rounded">
          <div className="form-group">
            <label htmlFor="name">Workout Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="duration">Duration (in minutes)</label>
            <input
              type="text"
              id="duration"
              className="form-control"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success btn-block mt-3">
            Add Workout
          </button>
        </form>
      )}

      {workouts.length > 0 ? (
        <ul className="list-group mt-3 workout-list">
          {workouts.map((workout) => (
            <li key={workout.id} className="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded my-2">
              <div>
                <h5 className="mb-1">{workout.name}</h5>
                <p className="mb-0">Duration: {workout.duration} </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center mt-4">No workouts found. Start logging your workouts!</p>
      )}
    </div>
  );
}

export default Workout;
