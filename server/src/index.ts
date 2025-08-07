
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  loginInputSchema,
  createFacilityInputSchema,
  updateFacilityInputSchema,
  createLoanInputSchema,
  returnLoanInputSchema,
  createMaintenanceInputSchema,
  updateMaintenanceInputSchema
} from './schema';

// Import handlers
import { login } from './handlers/login';
import { createFacility } from './handlers/create_facility';
import { getFacilities } from './handlers/get_facilities';
import { updateFacility } from './handlers/update_facility';
import { deleteFacility } from './handlers/delete_facility';
import { createLoan } from './handlers/create_loan';
import { getLoans } from './handlers/get_loans';
import { returnLoan } from './handlers/return_loan';
import { createMaintenance } from './handlers/create_maintenance';
import { getMaintenance } from './handlers/get_maintenance';
import { updateMaintenance } from './handlers/update_maintenance';
import { getFacilityReport } from './handlers/get_facility_report';
import { getLoanReport } from './handlers/get_loan_report';
import { getMaintenanceReport } from './handlers/get_maintenance_report';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => login(input)),

  // Facility management
  createFacility: publicProcedure
    .input(createFacilityInputSchema)
    .mutation(({ input }) => createFacility(input)),

  getFacilities: publicProcedure
    .query(() => getFacilities()),

  updateFacility: publicProcedure
    .input(updateFacilityInputSchema)
    .mutation(({ input }) => updateFacility(input)),

  deleteFacility: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteFacility(input)),

  // Loan management
  createLoan: publicProcedure
    .input(createLoanInputSchema)
    .mutation(({ input }) => createLoan(input)),

  getLoans: publicProcedure
    .query(() => getLoans()),

  returnLoan: publicProcedure
    .input(returnLoanInputSchema)
    .mutation(({ input }) => returnLoan(input)),

  // Maintenance management
  createMaintenance: publicProcedure
    .input(createMaintenanceInputSchema)
    .mutation(({ input }) => createMaintenance(input)),

  getMaintenance: publicProcedure
    .query(() => getMaintenance()),

  updateMaintenance: publicProcedure
    .input(updateMaintenanceInputSchema)
    .mutation(({ input }) => updateMaintenance(input)),

  // Reports
  getFacilityReport: publicProcedure
    .query(() => getFacilityReport()),

  getLoanReport: publicProcedure
    .query(() => getLoanReport()),

  getMaintenanceReport: publicProcedure
    .query(() => getMaintenanceReport()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
