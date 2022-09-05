/// <reference types="react" />
interface IProjectCard {
    project: string;
    size: "lg" | "md" | "sm" | "xs";
    icon: string;
    description: string;
    className: string;
    disabled?: boolean;
}
declare const ProjectCard: ({ icon, project, description, className, size, disabled }: IProjectCard) => JSX.Element;
export default ProjectCard;
