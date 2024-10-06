import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";

import SearchIcon from "@mui/icons-material/Search";

 const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "8px",
  backgroundColor: "#f0f2f5",
  height: "35px",
  border: `1px solid #f0f2f5`,
  "&:hover": {
    border: `1px solid ${theme.palette.primary.light}`,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "100%",
  },
}));

 const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0.6, 1.2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

 const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(0.5, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },
}));

const SearchBox = (props) => {
  const { placeholder,disabled,onSearch } = props;

return (
  <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                 onChange={(e) => onSearch(e.target.value)}
                  placeholder={placeholder}
                  disabled={disabled}
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
  );
};

export default SearchBox;