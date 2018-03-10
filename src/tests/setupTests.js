import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

// Setup enzyme for react testing
Enzyme.configure({ adapter: new EnzymeAdapter() });
