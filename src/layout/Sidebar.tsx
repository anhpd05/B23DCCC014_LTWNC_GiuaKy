import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { STUDENT } from '../constants/library';
import { BorrowedList } from '../features/books/components/BorrowedList';
import { selectBooks } from '../features/books/selectors';
import { ThemeToggle } from '../features/theme/ThemeToggle';

const navClass = ({ isActive }: { isActive: boolean }) => `nav__link${isActive ? ' is-active' : ''}`;

export function Sidebar() {
  const totalTitles = useAppSelector(selectBooks).length;

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand__logo" aria-hidden="true">
          M
        </span>
        <div className="brand__text">
          <span className="brand__name">
            Mini Library<span>.</span>
          </span>
          <span className="muted">Thư viện khoa</span>
        </div>
      </div>

      <nav className="nav" aria-label="Điều hướng chính">
        <span className="eyebrow">QUẢN LÝ</span>
        <NavLink to="/" end className={navClass}>
          <span className="nav__label">
            <span className="nav__icon" aria-hidden="true">
              ▤
            </span>
            Kho sách
          </span>
          <span className="mono nav__count">{totalTitles}</span>
        </NavLink>
        <NavLink to="/stats" className={navClass}>
          <span className="nav__label">
            <span className="nav__icon" aria-hidden="true">
              ◔
            </span>
            Thống kê
          </span>
          <span className="mono nav__count">/stats</span>
        </NavLink>
      </nav>

      <BorrowedList />

      <div className="sidebar__foot">
        <ThemeToggle />
        <div className="user">
          <span className="user__avatar" aria-hidden="true">
            SV
          </span>
          <div className="user__text">
            <span className="user__name">{STUDENT.name}</span>
            <span className="mono muted">MSSV {STUDENT.id}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
