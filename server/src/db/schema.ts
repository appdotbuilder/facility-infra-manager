
import { serial, text, pgTable, timestamp, numeric, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define enums
export const facilityCategory = pgEnum('facility_category', ['building', 'equipment', 'vehicle', 'furniture', 'technology', 'other']);
export const facilityStatus = pgEnum('facility_status', ['available', 'in_use', 'maintenance', 'retired']);
export const loanStatus = pgEnum('loan_status', ['active', 'returned', 'overdue']);
export const maintenanceType = pgEnum('maintenance_type', ['preventive', 'corrective', 'emergency', 'inspection']);
export const maintenanceStatus = pgEnum('maintenance_status', ['scheduled', 'in_progress', 'completed', 'cancelled']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Facilities table
export const facilitiesTable = pgTable('facilities', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  location: text('location').notNull(),
  category: facilityCategory('category').notNull(),
  status: facilityStatus('status').notNull().default('available'),
  acquisition_date: timestamp('acquisition_date'),
  purchase_price: numeric('purchase_price', { precision: 12, scale: 2 }),
  current_value: numeric('current_value', { precision: 12, scale: 2 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Loans table
export const loansTable = pgTable('loans', {
  id: serial('id').primaryKey(),
  facility_id: integer('facility_id').notNull().references(() => facilitiesTable.id),
  borrower_name: text('borrower_name').notNull(),
  borrower_contact: text('borrower_contact'),
  purpose: text('purpose').notNull(),
  loan_date: timestamp('loan_date').notNull(),
  expected_return_date: timestamp('expected_return_date'),
  actual_return_date: timestamp('actual_return_date'),
  status: loanStatus('status').notNull().default('active'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Maintenance table
export const maintenanceTable = pgTable('maintenance', {
  id: serial('id').primaryKey(),
  facility_id: integer('facility_id').notNull().references(() => facilitiesTable.id),
  maintenance_type: maintenanceType('maintenance_type').notNull(),
  description: text('description').notNull(),
  scheduled_date: timestamp('scheduled_date'),
  completed_date: timestamp('completed_date'),
  cost: numeric('cost', { precision: 10, scale: 2 }),
  technician: text('technician'),
  status: maintenanceStatus('status').notNull().default('scheduled'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const facilitiesRelations = relations(facilitiesTable, ({ many }) => ({
  loans: many(loansTable),
  maintenance: many(maintenanceTable),
}));

export const loansRelations = relations(loansTable, ({ one }) => ({
  facility: one(facilitiesTable, {
    fields: [loansTable.facility_id],
    references: [facilitiesTable.id],
  }),
}));

export const maintenanceRelations = relations(maintenanceTable, ({ one }) => ({
  facility: one(facilitiesTable, {
    fields: [maintenanceTable.facility_id],
    references: [facilitiesTable.id],
  }),
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Facility = typeof facilitiesTable.$inferSelect;
export type NewFacility = typeof facilitiesTable.$inferInsert;

export type Loan = typeof loansTable.$inferSelect;
export type NewLoan = typeof loansTable.$inferInsert;

export type Maintenance = typeof maintenanceTable.$inferSelect;
export type NewMaintenance = typeof maintenanceTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  users: usersTable,
  facilities: facilitiesTable,
  loans: loansTable,
  maintenance: maintenanceTable,
};
