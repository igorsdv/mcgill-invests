import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Icon(props) {
  // prevent unstyled svg flashing
  return <FontAwesomeIcon fixedWidth width={0} height={0} {...props} />;
}

export function Spinner() {
  return <Icon icon={faCircleNotch} className="fa-spin" />;
}
