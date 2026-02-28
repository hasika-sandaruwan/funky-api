import { Response } from "express";
import Bin from "../model/Bin.model";
import BinRemovalLog from "../model/BinRemovalLog.model";
import Notification from "../model/Notification.model";
import { AuthRequest } from "../middleware/auth.middleware";

/* --------------------------------
   CREATE BIN REMOVAL
-------------------------------- */
export const createBinRemoval = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const { binId } = req.body;

        if (!binId) {
            return res.status(400).json({ message: "Bin required" });
        }

        const user = req.user;
        const userId = user.id || user._id;

        /* -----------------------------
           CHECK DAILY LIMIT (MAX 3)
        ------------------------------ */

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayCount = await BinRemovalLog.countDocuments({
            employeeId: userId,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        if (todayCount >= 3) {
            return res.status(400).json({
                message: "Maximum 3 bin removals allowed per day",
            });
        }

        /* -----------------------------
           FIND BIN
        ------------------------------ */

        const bin = await Bin.findById(binId);
        if (!bin) {
            return res.status(404).json({ message: "Bin not found" });
        }

        /* -----------------------------
           CREATE LOG
        ------------------------------ */

        const log = await BinRemovalLog.create({
            binId: bin._id,

            bin: {
                id: bin._id,
                name: bin.name,
                icon: bin.icon,
            },

            employeeId: userId,

            employee: {
                id: userId,
                name: user.name,
                email: user.email,
            },

            date: new Date(),
            approved: true,
        });

        await Notification.create({
            title: `${user.name} removed ${bin.name}`,
            relatedId: log._id,
            type: "bin",
            read: false,
        });

        res.status(201).json({
            message: "Bin removal logged",
            remaining: 3 - (todayCount + 1),
            data: log,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
// GET today's logs
export const getTodayBinRemovals = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const userId = req.user.id || req.user._id;

        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const logs = await BinRemovalLog.find({
            employeeId: userId,
            date: { $gte: start, $lte: end },
        }).sort({ createdAt: -1 });

        res.json(logs);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/bin-removal/range
export const getBinRemovalsByRange = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.id || req.user._id;
    const { startDate, endDate, history } = req.query;

    let filter: any = {
      
    };

    if (history !== "true") {
      if (!startDate) {
        return res
          .status(400)
          .json({ message: "startDate required" });
      }

      const start = new Date(startDate as string);
      const end = new Date(
        (endDate as string) || (startDate as string)
      );

      // 🔥 IMPORTANT FIX
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      filter.date = {
        $gte: start,
        $lte: end,
      };
    }

    console.log("Filter:", filter);

    const logs = await BinRemovalLog.find(filter)
      .sort({ date: -1 }); // sort by date, not createdAt

    res.json({ data: logs });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// DELETE /api/bin-removal/delete-all-history
export const deleteAllBinHistory = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const userId = req.user.id || req.user._id;

        await BinRemovalLog.deleteMany( );

        res.json({ message: "All bin history cleared" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};