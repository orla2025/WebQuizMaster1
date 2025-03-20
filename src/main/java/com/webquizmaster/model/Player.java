package com.webquizmaster.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
public class Player {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "goals")
    private Integer goals = 0;
    
    @Column(name = "assists")
    private Integer assists = 0;
    
    @Column(name = "matches_played")
    private Integer matchesPlayed = 0;
    
    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL)
    private List<Video> videos;
    
    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL)
    private List<PlayerParent> parentRelationships;
    
    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL)
    private List<AccessRequest> accessRequests;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
} 