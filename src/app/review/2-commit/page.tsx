'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReviewLayout } from '../layout-wrapper';
import { Button, Input, Textarea } from '@/components/ui';
import { ArrowLeft, ArrowRight, Plus, Trash2, AlertCircle, Info, Users, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Commitment {
  id: string;
  person: string;
  commitment: string;
  status: 'on_track' | 'at_risk' | 'blocked' | 'completed';
}

interface Deliverable {
  id: string;
  name: string;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
}

interface FamilyCommitment {
  id: string;
  person: string;
  need: string;
}

const STATUS_OPTIONS = [
  { value: 'on_track', label: 'On Track', color: 'bg-success-green' },
  { value: 'at_risk', label: 'At Risk', color: 'bg-streak-gold' },
  { value: 'blocked', label: 'Blocked', color: 'bg-warning-red' },
  { value: 'completed', label: 'Completed', color: 'bg-rest-blue' },
] as const;

export default function ReviewCommitmentsPage() {
  const router = useRouter();
  const [commitments, setCommitments] = useState<Commitment[]>([
    { id: '1', person: '', commitment: '', status: 'on_track' },
  ]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { id: '1', name: '', dueDate: '', status: 'in_progress' },
  ]);
  const [familyCommitments, setFamilyCommitments] = useState<FamilyCommitment[]>([
    { id: '1', person: '', need: '' },
  ]);
  const [budgetAdmin, setBudgetAdmin] = useState('');
  const [sideProjectNotes, setSideProjectNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  
  // Validation checks
  const hasValidCommitments = commitments.every(c => c.person.trim() && c.commitment.trim());
  const hasValidDeliverables = deliverables.every(d => d.name.trim());
  const hasValidFamilyCommitments = familyCommitments.every(f => f.person.trim() && f.need.trim());
  const hasBudgetAdmin = budgetAdmin.trim().length > 0;
  const hasSideProjectNotes = sideProjectNotes.trim().length > 0;
  const isValid = hasValidCommitments && hasValidDeliverables && hasValidFamilyCommitments && hasBudgetAdmin && hasSideProjectNotes;
  
  const clearValidation = () => {
    if (showValidation) setShowValidation(false);
  };
  
  const addCommitment = () => {
    setCommitments(prev => [...prev, {
      id: Date.now().toString(),
      person: '',
      commitment: '',
      status: 'on_track',
    }]);
  };
  
  const removeCommitment = (id: string) => {
    if (commitments.length > 1) {
      setCommitments(prev => prev.filter(c => c.id !== id));
    }
  };
  
  const updateCommitment = (id: string, field: keyof Commitment, value: string) => {
    setCommitments(prev =>
      prev.map(c => c.id === id ? { ...c, [field]: value } : c)
    );
    clearValidation();
  };
  
  const addDeliverable = () => {
    setDeliverables(prev => [...prev, {
      id: Date.now().toString(),
      name: '',
      dueDate: '',
      status: 'not_started',
    }]);
  };
  
  const removeDeliverable = (id: string) => {
    if (deliverables.length > 1) {
      setDeliverables(prev => prev.filter(d => d.id !== id));
    }
  };
  
  const updateDeliverable = (id: string, field: keyof Deliverable, value: string) => {
    setDeliverables(prev =>
      prev.map(d => d.id === id ? { ...d, [field]: value } : d)
    );
    clearValidation();
  };
  
  const addFamilyCommitment = () => {
    setFamilyCommitments(prev => [...prev, {
      id: Date.now().toString(),
      person: '',
      need: '',
    }]);
  };
  
  const removeFamilyCommitment = (id: string) => {
    if (familyCommitments.length > 1) {
      setFamilyCommitments(prev => prev.filter(f => f.id !== id));
    }
  };
  
  const updateFamilyCommitment = (id: string, field: keyof FamilyCommitment, value: string) => {
    setFamilyCommitments(prev =>
      prev.map(f => f.id === id ? { ...f, [field]: value } : f)
    );
    clearValidation();
  };
  
  const handleNext = async () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }
    
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsSaving(false);
    router.push('/review/3-ahead');
  };
  
  return (
    <ReviewLayout
      currentStep={2}
      stepTitle="Review Commitments"
      timeEstimate="20-25 min"
    >
      <div className="space-y-6">
        <p className="font-body text-text-secondary">
          For each area, ask: What needs my attention? What's the next action?
        </p>
        
        {/* CliftonStrengths Callout */}
        <div className="flex items-start gap-3 rounded-lg border-2 border-success-green/30 bg-success-green/5 p-4">
          <Users className="h-5 w-5 flex-shrink-0 text-success-green mt-0.5" />
          <div className="font-body text-sm text-text-secondary">
            <strong className="text-success-green">Your Individualization (#7) sees each person uniquely.</strong> This 
            step ensures you're tracking what each person specifically needs from you — at work and at home.
          </div>
        </div>
        
        {/* Validation Warning */}
        {showValidation && !isValid && (
          <div className="flex items-start gap-3 rounded-lg border-2 border-warning-red bg-warning-red/10 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-warning-red mt-0.5" />
            <div className="font-body text-sm text-warning-red">
              <strong>Complete all sections before continuing:</strong>
              <ul className="mt-1 list-disc list-inside">
                {!hasValidCommitments && <li>Fill in all team commitment fields (person & what they need)</li>}
                {!hasValidDeliverables && <li>Fill in all deliverable names</li>}
                {!hasValidFamilyCommitments && <li>Fill in all family commitment fields (person & what they need)</li>}
                {!hasBudgetAdmin && <li>Add budget & admin notes</li>}
                {!hasSideProjectNotes && <li>Add ValleySomm progress notes</li>}
              </ul>
            </div>
          </div>
        )}
        
        {/* Team Commitments */}
        <div className="card">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
              Team & Leadership
            </h2>
            <Button variant="ghost" size="sm" onClick={addCommitment}>
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
          
          {/* Carry-forward info */}
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-success-green/10 p-3 text-success-green">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p className="text-xs">
              These will carry forward each week. Update status as things change.
            </p>
          </div>
          
          <div className="space-y-4">
            {commitments.map((commitment) => (
              <div key={commitment.id} className="space-y-3 rounded-lg border border-warm-gray p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-3">
                    <Input
                      placeholder="Person / Area"
                      value={commitment.person}
                      onChange={(e) => updateCommitment(commitment.id, 'person', e.target.value)}
                      error={showValidation && !commitment.person.trim() ? "Required" : undefined}
                    />
                    <Input
                      placeholder="What do they need from me?"
                      value={commitment.commitment}
                      onChange={(e) => updateCommitment(commitment.id, 'commitment', e.target.value)}
                      error={showValidation && !commitment.commitment.trim() ? "Required" : undefined}
                    />
                  </div>
                  {commitments.length > 1 && (
                    <button
                      onClick={() => removeCommitment(commitment.id)}
                      className="mt-3 text-medium-gray hover:text-warning-red"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateCommitment(commitment.id, 'status', option.value)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                        commitment.status === option.value
                          ? `${option.color} text-white`
                          : 'bg-warm-gray text-text-secondary hover:bg-warm-gray/80'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Family & Personal */}
        <div className="card border-rest-blue/30 bg-rest-blue/5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-rest-blue" />
              <h2 className="font-display text-sm uppercase tracking-wider text-rest-blue">
                Family & Personal
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={addFamilyCommitment}>
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
          
          {/* Info */}
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-rest-blue/10 p-3 text-rest-blue">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p className="text-xs">
              Who at home needs something from you this week? Partner, kids, parents, friends.
            </p>
          </div>
          
          <div className="space-y-4">
            {familyCommitments.map((fc) => (
              <div key={fc.id} className="flex items-start gap-3 rounded-lg border border-rest-blue/30 bg-white p-4">
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder="Who? (e.g., Sarah, Kids, Mom)"
                    value={fc.person}
                    onChange={(e) => updateFamilyCommitment(fc.id, 'person', e.target.value)}
                    error={showValidation && !fc.person.trim() ? "Required" : undefined}
                  />
                  <Input
                    placeholder="What do they need from me this week?"
                    value={fc.need}
                    onChange={(e) => updateFamilyCommitment(fc.id, 'need', e.target.value)}
                    error={showValidation && !fc.need.trim() ? "Required" : undefined}
                  />
                </div>
                {familyCommitments.length > 1 && (
                  <button
                    onClick={() => removeFamilyCommitment(fc.id)}
                    className="mt-3 text-medium-gray hover:text-warning-red"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Deliverables */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-sm uppercase tracking-wider text-text-secondary">
              Your Work & Deliverables
            </h2>
            <Button variant="ghost" size="sm" onClick={addDeliverable}>
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
          
          <div className="space-y-4">
            {deliverables.map((deliverable) => (
              <div key={deliverable.id} className="flex items-start gap-3 rounded-lg border border-warm-gray p-4">
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder="Project / Deliverable"
                    value={deliverable.name}
                    onChange={(e) => updateDeliverable(deliverable.id, 'name', e.target.value)}
                    error={showValidation && !deliverable.name.trim() ? "Required" : undefined}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="date"
                      value={deliverable.dueDate}
                      onChange={(e) => updateDeliverable(deliverable.id, 'dueDate', e.target.value)}
                    />
                    <select
                      value={deliverable.status}
                      onChange={(e) => updateDeliverable(deliverable.id, 'status', e.target.value)}
                      className="h-12 rounded-lg border-2 border-warm-gray bg-white px-3 font-body text-text-primary focus:border-focus-orange focus:outline-none"
                    >
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                {deliverables.length > 1 && (
                  <button
                    onClick={() => removeDeliverable(deliverable.id)}
                    className="mt-3 text-medium-gray hover:text-warning-red"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Budget & Admin */}
        <div className="card">
          <Textarea
            label="Budget & Admin"
            placeholder="Approvals pending, budget items, HR tasks..."
            value={budgetAdmin}
            onChange={(e) => { setBudgetAdmin(e.target.value); clearValidation(); }}
            error={showValidation && !hasBudgetAdmin ? "Required" : undefined}
          />
        </div>
        
        {/* Side Project - ValleySomm */}
        <div className="card border-focus-orange/30 bg-focus-orange/5">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg">🍷</span>
            <h2 className="font-display text-sm uppercase tracking-wider text-focus-orange">
              ValleySomm Progress
            </h2>
          </div>
          <Textarea
            placeholder="What did you accomplish this week on ValleySomm?"
            value={sideProjectNotes}
            onChange={(e) => { setSideProjectNotes(e.target.value); clearValidation(); }}
            error={showValidation && !hasSideProjectNotes ? "Required" : undefined}
          />
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Link href="/review/1-clear">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </Link>
          
          <Button onClick={handleNext} isLoading={isSaving}>
            Next: Look Ahead
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-center font-display text-xs text-medium-gray">
          ✓ Auto-saved
        </p>
      </div>
    </ReviewLayout>
  );
}
