import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RoomModuleComponent } from "./room-module.component";

describe("RoomModuleComponent", () => {
  let component: RoomModuleComponent;
  let fixture: ComponentFixture<RoomModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoomModuleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
