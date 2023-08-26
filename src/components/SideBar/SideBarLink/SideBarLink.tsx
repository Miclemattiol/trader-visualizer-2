import './SideBarLink.scss';

type Props = {
    name: string;
    icon: React.ReactNode;
    href?: string;
}

export const SideBarLink = ({ name, icon, href }: Props) => {

    //const [Active, setActive] = useState(true);

    return (
        <div className='SideBarLink'>
            <a href={href}>
                <div className="icon">
                    {icon}
                </div>
                <span className='name'>{name}</span>
            </a>
        </div>
    )
}