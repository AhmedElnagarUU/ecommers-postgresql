import { CleanupService, CleanupStatus } from '../modules/cleanup/cleanup.service';

const cleanupService = new CleanupService();

// Interval in milliseconds (24 hours)
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000;

/**
 * Process pending cleanup tasks on a schedule
 */
export const startCleanupScheduler = () => {
  console.log('Starting cleanup scheduler');
  
  // Process immediately on startup
  processCleanupTasks();
  
  // Then schedule regular processing
  setInterval(processCleanupTasks, CLEANUP_INTERVAL);
};

/**
 * Process pending cleanup tasks
 */
async function processCleanupTasks() {
  try {
    console.log(`[${new Date().toISOString()}] Running scheduled cleanup task processing`);
    const pendingCleanups = await cleanupService.getPendingCleanups();
    
    if (pendingCleanups.length === 0) {
      console.log('No pending cleanup tasks to process');
      return;
    }
    
    console.log(`Processing ${pendingCleanups.length} pending cleanup tasks`);
    
    let processed = 0;
    let succeeded = 0;
    let failed = 0;

    for (const cleanup of pendingCleanups.slice(0, 20)) { // Process up to 20 tasks at once
      try {
        await cleanupService.updateCleanupStatus(cleanup.id, 'in_progress' as CleanupStatus);
        // Add your cleanup logic here based on cleanup.type
        await cleanupService.updateCleanupStatus(cleanup.id, 'completed' as CleanupStatus);
        succeeded++;
      } catch (error: any) {
        await cleanupService.updateCleanupStatus(cleanup.id, 'failed' as CleanupStatus, error?.message || 'Unknown error');
        failed++;
      }
      processed++;
    }
    
    console.log(`Cleanup processing complete:
      - Processed: ${processed}
      - Succeeded: ${succeeded}
      - Failed: ${failed}`);
  } catch (error) {
    console.error('Error in scheduled cleanup task processing:', error);
  }
} 