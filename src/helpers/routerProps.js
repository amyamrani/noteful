import PropTypes from "prop-types";

const routerProps = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default routerProps;
