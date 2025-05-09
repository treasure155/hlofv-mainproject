exports.renderUpcomingEvents = (req, res) => {
    const events = [
      {
        title: 'Widow Empowerment Workshop',
        program: 'Widow Support Program',
        description: 'Empowering widows with entrepreneurial skills and startup support.'
      },
      {
        title: 'Orphan Scholarship Outreach',
        program: 'Orphan Education Program',
        description: 'Scholarship and school supply distribution to orphans.'
      },
      {
        title: 'Food Drive for the Less Privileged',
        program: 'Food Support Program',
        description: 'Distribution of food items to vulnerable communities.'
      },
      {
        title: 'Healthcare for Widows',
        program: 'Health Support Program',
        description: 'Free medical checkup and consultation for widows.'
      },
      {
        title: 'Business Startup Grant for Women',
        program: 'Women Economic Empowerment Program',
        description: 'Support for women to start or grow their businesses.'
      },
      {
        title: 'Safe Housing Support',
        program: 'Housing for Widows Program',
        description: 'Assistance with house rent for displaced widows.'
      },
      {
        title: 'Mentorship for Teen Girls',
        program: 'Girl Child Mentorship',
        description: 'Mentorship and empowerment sessions for young girls.'
      },
      {
        title: 'SMILE Outreach Day',
        program: 'Outreach & Advocacy Program',
        description: 'Street outreach to spread kindness, love, and hope.'
      }
    ];
  
    res.render('pages/events/upcoming', { events });
  };
  