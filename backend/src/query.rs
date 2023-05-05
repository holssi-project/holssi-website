use serde::Deserialize;

#[derive(Deserialize)]
pub(crate) struct ExePresignedQuery {
    pub(crate) nonce: String,
    pub(crate) file_name: String,
}

#[derive(Deserialize)]
pub(crate) struct EntPresignedQuery {
    pub(crate) file_name: String,
}

#[derive(Deserialize)]
pub(crate) struct NonceQuery {
    pub(crate) nonce: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct BuildBody {
    pub(crate) name: Option<String>,
    pub(crate) name_en: String,
    pub(crate) author: String,
    pub(crate) version: Option<String>,
    pub(crate) desc: Option<String>,
    pub(crate) platform: Option<String>,
    pub(crate) arch: Option<String>,
    pub(crate) use_bes: Option<bool>,
    pub(crate) use_boost_mode: Option<bool>,
}

impl BuildBody {
    pub(crate) fn to_cmd(&self) -> Vec<&str> {
        let mut cmd = vec!["--name-en", &self.name_en, "--author", &self.author];
        match self.name.as_deref() {
            None | Some("") => (),
            Some(name) => {
                cmd.push("--name");
                cmd.push(name);
            }
        }

        match self.version.as_deref() {
            None | Some("") => (),
            Some(version) => {
                cmd.push("--set-version");
                cmd.push(version);
            }
        }

        match self.desc.as_deref() {
            None | Some("") => (),
            Some(desc) => {
                cmd.push("--desc");
                cmd.push(desc);
            }
        }

        match self.platform.as_deref() {
            None | Some("") => (),
            Some(platform) => {
                cmd.push("--platform");
                cmd.push(platform);
            }
        }

        match self.arch.as_deref() {
            None | Some("") => (),
            Some(arch) => {
                cmd.push("--arch");
                cmd.push(arch);
            }
        }

        match self.use_bes {
            None | Some(false) => (),
            Some(_) => {
                cmd.push("--use-bes");
            }
        }

        match self.use_boost_mode {
            None | Some(false) => (),
            Some(_) => {
                cmd.push("--use-boost-mode");
            }
        }

        cmd
    }
}
