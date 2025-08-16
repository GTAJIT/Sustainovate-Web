import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
  res.end("Wellcome to Sustainovate - Api");
});
export default router;
