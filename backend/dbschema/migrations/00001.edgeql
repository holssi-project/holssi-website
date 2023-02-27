CREATE MIGRATION m1xojonmshvukp3moirdr6nuxokyywudl24y2ojsb3w7qt5ew4l73q
    ONTO initial
{
  CREATE FUTURE nonrecursive_access_policies;
  CREATE TYPE default::File {
      CREATE REQUIRED PROPERTY created -> std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
      CREATE REQUIRED PROPERTY name -> std::str;
  };
  CREATE SCALAR TYPE default::ProjectStatus EXTENDING enum<Created, Building, Finished>;
  CREATE TYPE default::Project {
      CREATE LINK entry_file -> default::File;
      CREATE LINK executable -> default::File;
      CREATE REQUIRED PROPERTY created -> std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
      CREATE REQUIRED PROPERTY status -> default::ProjectStatus {
          SET default := (default::ProjectStatus.Created);
      };
  };
  CREATE TYPE default::RateLimit {
      CREATE REQUIRED PROPERTY count -> std::int32;
      CREATE REQUIRED PROPERTY ip -> std::str;
      CREATE REQUIRED PROPERTY reset_datetime -> std::datetime;
  };
};
