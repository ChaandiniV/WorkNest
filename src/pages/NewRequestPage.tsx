import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { createRequest } from '../services/requestService';
import { RequestForm, RequestFormValues } from '../components/forms/RequestForm';
import { Toast } from '../components/feedback/Toast';
import { ServiceRequest } from '../types/request.types';

export function NewRequestPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const onSubmit = async (values: RequestFormValues) => {
    setSuccess(false);
    setError(null);

    if (!user) {
      setError('User session missing.');
      return;
    }

    try {
      const request: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt' | 'slaDeadline' | 'comments' | 'auditLog'> = {
        title: values.title,
        category: values.category,
        priority: values.priority,
        department: values.department,
        description: values.description,
        requesterId: user.id,
        status: 'Open'
      } as any;

      await createRequest(request);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      navigate('/requests');
    } catch (err) {
      setError('Unable to submit request.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Create request</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Submit a new service ticket</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Use the form below to send a request to the support team and track it from your dashboard.</p>
      </div>
      <RequestForm onSubmit={onSubmit} />
      {success ? <Toast message="Request submitted successfully" type="success" /> : null}
      {error ? <Toast message={error} type="error" /> : null}
    </div>
  );
}
