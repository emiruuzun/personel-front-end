import React from 'react';
import Dashboardlayout from '../../layout/DashboardLayout';
import { NavLink } from 'react-router-dom';
import { menuItem } from '../../utils/MenuItem';

function Dashoard() {
  return (
    <Dashboardlayout>
      <div className="space-y-8">
        <div className="space-y-10 text-gray-100">
          {menuItem.map((section) => {
            return (
              <div key={section.name} className="space-y-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-100">
                  {section.name}
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {section.items.map((item) => {
                    return (
                      <NavLink
                        to={`/${item.slug}`}
                        key={item.name}
                        className="group block space-y-1.5 rounded-lg bg-gray-200 px-5 py-3 hover:bg-gray-600"
                      >
                        <div className="font-medium text-gray-800 group-hover:text-white">
                          {item.name}
                        </div>
                        {item.description ? (
                          <div className="text-sm text-gray-600 line-clamp-3 group-hover:text-white">
                            {item.description}
                          </div>
                        ) : null}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Dashboardlayout>
  );
}

export default Dashoard;