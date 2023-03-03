const allocateLeads = async (req, res) => {
    try {
      const clientLeads = req.body.task;
      if (!isValidRequest(req.body)) {
        return res.status(422).send({ status: false, message: "Invalid! request" });
      }
      if (clientLeads.length === 0) {
        return res.status(400).send({ status: false, message: "Leads are empty" });
      }
  
      const validClientLeads = clientLeads.filter(
        (ele) => ele.name && ele.email && ele.contact && ele.message
      );
      if (validClientLeads.length !== clientLeads.length) {
        return res
          .status(400)
          .send({ status: false, message: "Client info is missing" });
      }
  
      const arr = validClientLeads.map((ele) => ({
        name: ele.name,
        email: ele.email.toLowerCase(),
        contact: ele.contact,
        message: ele.message,
      }));
  
      const employees = await Users.find();
      const numberOfEmployees = employees.length;
      const numberOfLeads = arr.length;
      const leadsPerEmployee = Math.floor(numberOfLeads / numberOfEmployees);
      const remainingLeads = numberOfLeads % numberOfEmployees;
      let leadsAssigned = 0;
  
      const createLeads = async (employee, leadsToAssign) => {
        const tasks = arr.slice(leadsAssigned, leadsAssigned + leadsToAssign);
        const newLeads = tasks.map((task) => ({
          employeeId: employee.employeeId,
          userName: employee.userName,
          assignTo: employee.name,
          tasks: [task],
        }));
        await Leads.insertMany(newLeads);
        leadsAssigned += leadsToAssign;
      };
  
      const createPromises = employees.map((employee, i) => {
        const employeeLeadsPromise = Leads.find({ employeeId: employee.employeeId });
        const leadsToAssign = leadsPerEmployee + (i < remainingLeads ? 1 : 0);
        return employeeLeadsPromise.then((employeeLeads) => {
          const numberOfEmployeeLeads = employeeLeads.length;
          const leadsToCreate = leadsToAssign - numberOfEmployeeLeads;
          if (leadsToCreate > 0) {
            return createLeads(employee, leadsToCreate);
          }
        });
      });
  
      await Promise.all(createPromises);
  
      const leadsData = await Leads.find().sort({ createdAt: 1 });
      return res.status(200).send({ status: true, leads: leadsData });
    } catch (error) {
      return res.status(500).send({ status: false, Error: error.message });
    }
  };
  