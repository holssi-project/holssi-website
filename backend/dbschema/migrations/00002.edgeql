CREATE MIGRATION m1pwvcqevxodnoyk3gzv6otxibt36abeeflndcwzocgpnfbzalb3ga
    ONTO m1xojonmshvukp3moirdr6nuxokyywudl24y2ojsb3w7qt5ew4l73q
{
  ALTER TYPE default::Project {
      CREATE PROPERTY exe_nonce -> std::str;
  };
  ALTER SCALAR TYPE default::ProjectStatus EXTENDING enum<Created, Uploaded, Building, Success, Failed>;
};
