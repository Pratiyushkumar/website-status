import classNames from '@/styles/tasks.module.scss';

import { useGetAllTasksQuery } from '@/app/services/tasksApi';
import updateTasksStatus from '@/helperFunctions/updateTasksStatus';
import task, { Tab } from '@/interfaces/task.type';
import { useState } from 'react';
import {
    NO_TASKS_FOUND_MESSAGE,
    TASKS_FETCH_ERROR_MESSAGE,
} from '../../constants/messages';
import { TabSection } from './TabSection';
import TaskList from './TaskList/TaskList';
import updateCardContent from '@/helperFunctions/updateCardContent';
import { useEditMode } from '@/hooks/useEditMode';
import useUserData from '@/hooks/useUserData';

export const TasksContent = () => {
    const { data: tasks = [], isError, isLoading } = useGetAllTasksQuery();
    const { isEditMode } = useEditMode();

    const { data: userData, isUserAuthorized } = useUserData();

    const isEditable = isUserAuthorized && isEditMode;
    const [activeTab, setActiveTab] = useState(Tab.IN_PROGRESS);

    const onSelect = (tab: Tab) => {
        setActiveTab(tab);
    };

    const tasksGroupedByStatus = updateTasksStatus(tasks).reduce(
        (acc: Record<string, task[]>, curr: task) => {
            return acc[curr.status as keyof task]
                ? {
                      ...acc,
                      [curr.status]: [...acc[curr.status as keyof task], curr],
                  }
                : { ...acc, [curr.status]: [curr] };
        },
        {}
    );

    if (isError) return <p>{TASKS_FETCH_ERROR_MESSAGE}</p>;

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className={classNames.tasksContainer}>
            <TabSection onSelect={onSelect} activeTab={activeTab} />
            <div>
                {tasksGroupedByStatus[activeTab] ? (
                    <TaskList
                        tasks={tasksGroupedByStatus[activeTab]}
                        isEditable={isEditable}
                        updateCardContent={updateCardContent}
                    />
                ) : (
                    <p>{NO_TASKS_FOUND_MESSAGE}</p>
                )}
            </div>
        </div>
    );
};
