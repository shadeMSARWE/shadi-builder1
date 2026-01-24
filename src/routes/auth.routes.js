const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/*
  Google OAuth
  يرجّع URL للفرونت (مش redirect)
*/
router.get("/google", async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: process.env.APP_URL || "http://localhost:3000/dashboard.html"
      }
    });

    if (error) {
      return res.status(400).json({
        ok: false,
        error: error.message
      });
    }

    res.json({
      ok: true,
      url: data.url
    });

  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(500).json({
      ok: false,
      error: "Auth failed"
    });
  }
});

module.exports = router;
