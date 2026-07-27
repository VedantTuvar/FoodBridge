import React, { useEffect, useState } from 'react';
import { taskApi } from '../api/taskApi';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Heading } from '../components/atoms/Typography';

export const VolunteerTasksPage = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    taskApi.getNearbyTasks().then((res) => setTasks(res.data.results || []));
  }, []);

  const handleAccept = async (taskId) => {
    try {
      await taskApi.acceptTask(taskId);
      alert('Task accepted!');
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      alert('Error accepting task.');
    }
  };

  return (
    <div>
      <Heading level={2}>Available Pickup Tasks</Heading>
      <p style={{ color: 'var(--ink-soft)', marginBottom: '24px' }}>
        Accept tasks to deliver surplus food from donors to shelters.
      </p>

      {tasks.length === 0 ? (
        <div className="card-paper-alt" style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-soft)' }}>No available tasks nearby at this time.</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="card" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>Task #{task.id.slice(0, 8)}</span>
              <Badge status={task.status} />
            </div>
            <p style={{ fontSize: '15px', color: 'var(--ink)', marginBottom: '12px' }}>
              📍 Pickup: {task.donation_detail?.pickup_address}
            </p>
            <Button variant="amber" onClick={() => handleAccept(task.id)}>
              Accept Pickup Task
            </Button>
          </div>
        ))
      )}
    </div>
  );
};
