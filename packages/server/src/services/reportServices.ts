import Report from '../reports/Report';
import ReportType from '../types/Report';
import { ErrorREST, Errors } from '../utilities/ErrorREST';
const createReport = async (
  userId: string,
  reportedUserId: string,
  communityId: string,
  ruleId: string | undefined,
  sourceId: string,
  reason: string,
  onModel: string,
): Promise<void> => {
  try {
    const report = new Report({
      user: userId,
      reportedUser: reportedUserId,
      community: communityId,
      reason,
      source: sourceId,
      onModel,
    });
    if (ruleId) {
      report.rule = ruleId;
    }
    await report.save();
  } catch (err) {
    throw err;
  }
};

const getReportsByCommunityId = async (
  communityId: string,
): Promise<ReportType[]> => {
  try {
    const reports = await Report.find({ community: communityId });
    if (!reports || reports.length < 0) {
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message);
      throw error;
    }
    return reports;
  } catch (err) {
    throw err;
  }
};
const getReportById = async (reportId: string): Promise<ReportType> => {
  try {
    const report = await Report.findById(reportId);
    if (!report) {
      const { status, message } = Errors.NotFound;
      const error = new ErrorREST(status, message);
      throw error;
    }
    return report;
  } catch (err) {
    throw err;
  }
};

export { createReport, getReportsByCommunityId, getReportById };
