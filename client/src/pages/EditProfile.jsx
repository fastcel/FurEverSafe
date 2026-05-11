useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setForm((prev) => ({
        ...prev,
        name: data.name || "",
        email: data.email || "",
        phone: data.contact_number || "",
        registrationNo: data.registrationNo || "",
        website: data.website || "",

        // keep passwords empty always
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      console.error("FETCH PROFILE ERROR:", err.message);
    }
  };

  fetchProfile();
}, []);