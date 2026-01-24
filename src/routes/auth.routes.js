const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();

/*
  Supabase client
  (يستخدم ANON KEY – صح)
*/
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/*
  =========================
  Google OAuth – PRODUCTION
  =========================

  ✔ redirect مباشر (res.redirect)
  ✔ بدون fetch / JSON
  ✔ يستخدم APP_URL فقط
  ✔ يحوّل على generate.html
*/
router.get("/google", async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.APP_URL}/generate.html`
      }
    });

    if (error || !data?.url) {
      console.error("SUPABASE OAUTH ERROR:", error);
      return res.status(400).send("OAuth failed");
    }

    // 🔥 هذا السطر هو الصح
    return res.redirect(data.url);

  } catch (err) {
    console.error("AUTH ROUTE ERROR:", err);
    return res.status(500).send("Auth error");
  }
});

module.exports = router;
