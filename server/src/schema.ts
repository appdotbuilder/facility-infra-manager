
import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password_hash: z.string(),
  created_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Login input schema
export const loginInputSchema = z.object({
  username: z.string(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// Facility schema
export const facilitySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  location: z.string(),
  category: z.enum(['building', 'equipment', 'vehicle', 'furniture', 'technology', 'other']),
  status: z.enum(['available', 'in_use', 'maintenance', 'retired']),
  acquisition_date: z.coerce.date().nullable(),
  purchase_price: z.number().nullable(),
  current_value: z.number().nullable(),
  created_at: z.coerce.date()
});

export type Facility = z.infer<typeof facilitySchema>;

// Create facility input schema
export const createFacilityInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  location: z.string().min(1),
  category: z.enum(['building', 'equipment', 'vehicle', 'furniture', 'technology', 'other']),
  acquisition_date: z.coerce.date().nullable().optional(),
  purchase_price: z.number().positive().nullable().optional(),
  current_value: z.number().positive().nullable().optional()
});

export type CreateFacilityInput = z.infer<typeof createFacilityInputSchema>;

// Update facility input schema
export const updateFacilityInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  location: z.string().min(1).optional(),
  category: z.enum(['building', 'equipment', 'vehicle', 'furniture', 'technology', 'other']).optional(),
  status: z.enum(['available', 'in_use', 'maintenance', 'retired']).optional(),
  acquisition_date: z.coerce.date().nullable().optional(),
  purchase_price: z.number().positive().nullable().optional(),
  current_value: z.number().positive().nullable().optional()
});

export type UpdateFacilityInput = z.infer<typeof updateFacilityInputSchema>;

// Loan/Usage schema
export const loanSchema = z.object({
  id: z.number(),
  facility_id: z.number(),
  borrower_name: z.string(),
  borrower_contact: z.string().nullable(),
  purpose: z.string(),
  loan_date: z.coerce.date(),
  expected_return_date: z.coerce.date().nullable(),
  actual_return_date: z.coerce.date().nullable(),
  status: z.enum(['active', 'returned', 'overdue']),
  notes: z.string().nullable(),
  created_at: z.coerce.date()
});

export type Loan = z.infer<typeof loanSchema>;

// Create loan input schema
export const createLoanInputSchema = z.object({
  facility_id: z.number(),
  borrower_name: z.string().min(1),
  borrower_contact: z.string().nullable().optional(),
  purpose: z.string().min(1),
  loan_date: z.coerce.date(),
  expected_return_date: z.coerce.date().nullable().optional(),
  notes: z.string().nullable().optional()
});

export type CreateLoanInput = z.infer<typeof createLoanInputSchema>;

// Return loan input schema
export const returnLoanInputSchema = z.object({
  id: z.number(),
  actual_return_date: z.coerce.date(),
  notes: z.string().nullable().optional()
});

export type ReturnLoanInput = z.infer<typeof returnLoanInputSchema>;

// Maintenance schema
export const maintenanceSchema = z.object({
  id: z.number(),
  facility_id: z.number(),
  maintenance_type: z.enum(['preventive', 'corrective', 'emergency', 'inspection']),
  description: z.string(),
  scheduled_date: z.coerce.date().nullable(),
  completed_date: z.coerce.date().nullable(),
  cost: z.number().nullable(),
  technician: z.string().nullable(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
  notes: z.string().nullable(),
  created_at: z.coerce.date()
});

export type Maintenance = z.infer<typeof maintenanceSchema>;

// Create maintenance input schema
export const createMaintenanceInputSchema = z.object({
  facility_id: z.number(),
  maintenance_type: z.enum(['preventive', 'corrective', 'emergency', 'inspection']),
  description: z.string().min(1),
  scheduled_date: z.coerce.date().nullable().optional(),
  cost: z.number().positive().nullable().optional(),
  technician: z.string().nullable().optional(),
  notes: z.string().nullable().optional()
});

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceInputSchema>;

// Update maintenance input schema
export const updateMaintenanceInputSchema = z.object({
  id: z.number(),
  maintenance_type: z.enum(['preventive', 'corrective', 'emergency', 'inspection']).optional(),
  description: z.string().min(1).optional(),
  scheduled_date: z.coerce.date().nullable().optional(),
  completed_date: z.coerce.date().nullable().optional(),
  cost: z.number().positive().nullable().optional(),
  technician: z.string().nullable().optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
  notes: z.string().nullable().optional()
});

export type UpdateMaintenanceInput = z.infer<typeof updateMaintenanceInputSchema>;

// Report schemas
export const facilityReportSchema = z.object({
  total_facilities: z.number(),
  by_category: z.record(z.number()),
  by_status: z.record(z.number()),
  total_value: z.number()
});

export type FacilityReport = z.infer<typeof facilityReportSchema>;

export const loanReportSchema = z.object({
  total_loans: z.number(),
  active_loans: z.number(),
  overdue_loans: z.number(),
  most_borrowed_facilities: z.array(z.object({
    facility_name: z.string(),
    loan_count: z.number()
  }))
});

export type LoanReport = z.infer<typeof loanReportSchema>;

export const maintenanceReportSchema = z.object({
  total_maintenance: z.number(),
  by_type: z.record(z.number()),
  by_status: z.record(z.number()),
  total_cost: z.number(),
  upcoming_maintenance: z.number()
});

export type MaintenanceReport = z.infer<typeof maintenanceReportSchema>;
