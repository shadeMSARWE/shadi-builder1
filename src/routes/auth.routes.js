const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/*
  Google OAuth
  Redirect مباشر (صح)
*/
router.get("/google", async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.APP_URL}/dashboard`
      }
    });

    if (error) {
      console.error("SUPABASE OAUTH ERROR:", error);
      return res.status(400).send("OAuth Error");
    }

    // 🔥 المهم: redirect مباشر
    return res.redirect(data.url);

  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(500).send("Auth failed");
  }
});

module.exports = router;
